const express = require('express')
const router = express.Router()
const { router: postRouter, postUrls } = require('./post-routes')
const { router: userRouter, authenticationUrls } = require('./user-routes')
const { getLoggedInUser } = require('../helpers/cacheHelpers')

const requireAuthenticationUrls = [...Object.values(postUrls).map((url) => `/posts${url}`)]
/* Register middleware to handle redirect to login page */
router.use((req, res, next) => {
  const { path } = req
  const loggedInUser = getLoggedInUser()

  const isRequireAuthenticate = requireAuthenticationUrls.includes(path)

  if (!loggedInUser && isRequireAuthenticate) {
    res.redirect(authenticationUrls.login)
  }

  res.locals.currentUser = loggedInUser
  next()
})

/* Register route for home page. */
router.get('/', function (req, res) {
  res.render('index')
})
router.use('/', userRouter)
router.use('/posts', postRouter)

module.exports = router
