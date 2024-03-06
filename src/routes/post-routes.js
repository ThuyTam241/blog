const express = require('express')
const router = express.Router()
const postDatabaseApi = require('../integration/PostDatabaseApi')
const categoryDatabaseApi = require('../integration/CategoryDatabaseApi')
const { ITEMS_PER_PAGE } = require('../integration/constant')
const { createPaginationNumbers } = require('../helpers/commonHelpers')

const postUrls = {
  allPosts: '',
  createPosts: '/create',
  updatePosts: '/update/:id',
  deletePosts: '/delete/:id',
}

router.get(postUrls.allPosts, async (req, res) => {
  const { categoryId, searchKey, sortBy, page } = req.query

  let categories = await categoryDatabaseApi.findAll()
  let result = {}

  if (!!categoryId || !!searchKey || !!sortBy) {
    result = await postDatabaseApi.findByCategoryAndSearchKey(categoryId, searchKey, sortBy, page)
  } else {
    result = await postDatabaseApi.findAll(page)
  }

  const paginationNumbers = createPaginationNumbers(result.totalItems, ITEMS_PER_PAGE)

  res.render('post-collection', { posts: result.posts, categories, paginationNumbers })
})

// Publish the routes and URL constants so other modules can use it
module.exports = {
  router,
  postUrls,
}
