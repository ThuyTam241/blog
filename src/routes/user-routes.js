const express = require('express');
const router = express.Router();
const userDatabaseApi = require('../integration/UserDatabaseApi');

router.get('/login', (req, res) => {
    res.render('pages/user/login');
});

router.get('/register', (req, res) => {
    res.render('pages/user/register');
});

router.post('/register', async (req, res) => {
    const { username, password, name, email } = req.body;
    const existingUser = await userDatabaseApi.getUserByUsername(username);
    if (existingUser) {
        return res.status(400).send('User already exists');
    }
    await userDatabaseApi.addUser({ username, password, name, email });
    res.redirect('/login');
});


router.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    console.log('username: ' ,username);
    const existingUser = await userDatabaseApi.getUserByUsername(username);
    if (existingUser) {
        req.session.loggedInUser = { username: existingUser.username };
        res.redirect('/posts');
    }
    res.render('pages/user/login', {message: 'Log in failed'});
});

module.exports = router