const express = require('express');
const router = express.Router();
const commentDatabaseApi = require('../integration/CommentDatabaseApi');
const { getLoggedInUser } = require('../helpers/cacheHelpers');
const { authenticationUrls } = require('./user-routes');

const commentUrls = {
  updateComment: '/:id',
  deleteComment: '/:id',
  replyComment: '/:id/reply',
};

// Register url to update comment
router.put(commentUrls.updateComment, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const currentUser = getLoggedInUser();
  if (!currentUser) {
    res.redirect(authenticationUrls.login);
    return;
  }

  try {
    await commentDatabaseApi.updateComment(id, currentUser._id, content);
    return res.status(200).send(`Updated comment with id=${id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while updating the comment');
  }
});

// Register url to delete comment
router.delete(commentUrls.deleteComment, async (req, res) => {
  const { id } = req.params;
  const currentUser = getLoggedInUser();
  if (!currentUser) {
    res.redirect(authenticationUrls.login);
    return;
  }

  try {
    await commentDatabaseApi.deleteComment(id, currentUser._id);
    return res.status(200).send(`Updated comment with id=${id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while deleting the comment');
  }
});

// Register url to reply comment
router.put(commentUrls.replyComment, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const currentUser = getLoggedInUser();
  if (!currentUser) {
    res.redirect(authenticationUrls.login);
    return;
  }

  try {
    await commentDatabaseApi.replyComment(id, currentUser.name, content);
    return res.status(200).send(`Reply comment with id=${id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while replying the comment');
  }
});

// Publish the routes and URL constants so other modules can use it
module.exports = {
  router,
  commentUrls,
};
