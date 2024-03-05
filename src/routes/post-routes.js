const express = require('express')
const router = express.Router()
const postDatabaseApi = require('../integration/PostDatabaseApi')
const categoryDatabaseApi = require('../integration/CategoryDatabaseApi')

const postUrls = {
  allPosts: '',
  createPosts: '/create',
  updatePosts: '/update/:id',
  deletePosts: '/delete/:id',
}

router.get(postUrls.allPosts, async (req, res) => {
  const { categoryId, searchKey, sortBy } = req.query

  let categories = await categoryDatabaseApi.findAll()
  let posts = []

  if (!!categoryId || !!searchKey || !!sortBy) {
    posts = await postDatabaseApi.findByCategoryAndSearchKey(categoryId, searchKey, sortBy)
  } else {
    posts = await postDatabaseApi.findAll()
  }

  res.render('post-collection', { posts, categories })
})

// Publish the routes and URL constants so other modules can use it
module.exports = {
  router,
  postUrls,
}
