const express = require('express');
const router = express.Router();
const postDatabaseApi = require('../integration/PostDatabaseApi');
const categoryDatabaseApi = require('../integration/CategoryDatabaseApi');
const { ITEMS_PER_PAGE } = require('../integration/constant');
const { createPaginationNumbers } = require('../helpers/commonHelpers');
const { getLoggedInUser } = require('../helpers/cacheHelpers');
const { authenticationUrls } = require('./user-routes');

const postUrls = {
  allPosts: '',
  detailPost: '/:id',
  likePost: '/:id/action/like',
  commentPost: '/:id/action/comment',
  createPosts: '/create',
  updatePosts: '/update/:id',
  deletePosts: '/delete/:id',
};

// Register url to go to the list of posts page
router.get(postUrls.allPosts, async (req, res) => {
  const { categoryId, searchKey, sortBy, page } = req.query;

  let categories = await categoryDatabaseApi.findAll();
  let result = {};

  if (!!categoryId || !!searchKey || !!sortBy) {
    result = await postDatabaseApi.findByCategoryAndSearchKey(categoryId, searchKey, sortBy, page);
  } else {
    result = await postDatabaseApi.findAll(page);
  }

  const paginationNumbers = createPaginationNumbers(result.totalItems, ITEMS_PER_PAGE);

  res.render('post-collection', { posts: result.posts, categories, paginationNumbers });
});

// Register url to go to the post detail page
router.get(postUrls.detailPost, async (req, res) => {
  const { id } = req.params;
  const currentUser = getLoggedInUser();
  let postDetail;

  try {
    postDetail = await postDatabaseApi.findById(id);
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while fetching the post');
  }

  if (!currentUser) {
    res.redirect(authenticationUrls.login);
    return;
  }

  if (!postDetail.post) {
    return res.status(404).send('Post not found');
  }

  const liked = postDetail.post.likes
    .map((id) => id.toString())
    .includes(currentUser._id.toString());
  res.render('post-detail', { ...postDetail, liked });
});

// Register url to like the post in the detail page
router.post(postUrls.likePost, async (req, res) => {
  const { id } = req.params;
  const currentUser = getLoggedInUser();
  if (!currentUser) {
    res.redirect(authenticationUrls.login);
    return;
  }

  try {
    await postDatabaseApi.likePost(id, currentUser._id);
    return res.status(200).send('Updated post');
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while fetching the post');
  }
});

// Register url to comment to the post in the detail page
router.post(postUrls.commentPost, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const currentUser = getLoggedInUser();
  if (!currentUser) {
    res.redirect(authenticationUrls.login);
    return;
  }

  try {
    await postDatabaseApi.commentPost(id, currentUser._id, content);
    return res.status(200).send('Created new comment');
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while fetching the post');
  }
});

// Publish the routes and URL constants so other modules can use it
module.exports = {
  router,
  postUrls,
};
