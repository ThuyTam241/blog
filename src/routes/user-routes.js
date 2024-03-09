const express = require('express')
const router = express.Router()
const userDatabaseApi = require('../integration/UserDatabaseApi')
const { getLoggedInUser, setLoggedInUser } = require('../helpers/cacheHelpers')

const authenticationUrls = {
  login: '/login',
  register: '/register',
  logout: '/logout',
}

// Redirect to login page when accessing the /login
router.get(authenticationUrls.login, (req, res) => {
  const loggedInUser = getLoggedInUser()
  if (!!loggedInUser) {
    res.redirect('/posts')
  }
  res.render('login')
})

// Redirect to login page when accessing the /logout
router.get(authenticationUrls.logout, (req, res) => {
  setLoggedInUser(null)
  res.redirect('login')
})

// Redirect to register page when accessing the /register
router.get(authenticationUrls.register, (req, res) => {
  res.render('register')
})

// Request to create new user
router.post(authenticationUrls.register, async (req, res) => {
  const { username, password, name, email } = req.body
  const existingUser = await userDatabaseApi.findByUsername(username)

  if (existingUser) {
    return res.status(400).send('User already exists')
  }

  await userDatabaseApi.addUser({ username, password, name, email })
  res.redirect(authenticationUrls.login)
})

// Verify that the login user is existing in the database
// If yes, save it to the session and redirect to all posts page
router.post(authenticationUrls.login, async (req, res) => {
  const { username, password } = req.body
  const user = await userDatabaseApi.findByUsernameAndPassword(username, password)

  if (user) {
    setLoggedInUser(user)
    res.redirect('/posts')
  }

  res.render('login', { message: 'Log in failed' })
})

module.exports = {
  router,
  authenticationUrls,
}
