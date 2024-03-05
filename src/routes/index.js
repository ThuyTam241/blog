const express = require('express')
const router = express.Router()
const { router: postRouter, postUrls } = require('./post-routes')
const { router: userRouter, authenticationUrls } = require('./user-routes')

const requireAuthenticationUrls = [...Object.values(postUrls).map((url) => `/posts${url}`)]
/* Register middleware to handle redirect to login page */
router.use((req, res, next) => {
  const { path } = req
  const isUserLoggedIn = !!req.session.loggedInUser

  const isRequireAuthenticate = requireAuthenticationUrls.includes(path)

  if (!isUserLoggedIn && isRequireAuthenticate) {
    res.redirect(authenticationUrls.login)
  }

  next()
})

/* Register route for home page. */
router.get('/', function (req, res) {
  res.render('index')
})
router.use('/', userRouter)
router.use('/posts', postRouter)

module.exports = router
