const express = require('express');
const router = express.Router();

/* Register route for home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* Register middleware to handle redirect to login page */
// router.use((req, res, next) => {
  // const { path } = req;
  // const loggedInUser = req.session.loggedInUser;
  // if (!loggedInUser && path !== '/users/authenticate') {
  //     return res.redirect('/users/login');
  // }
  // if ((loggedInUser && path === '/users/login') || (loggedInUser && path === '/users/register')) {
  //     return res.redirect('/posts');
  // }
  // next();
// });

module.exports = router;
