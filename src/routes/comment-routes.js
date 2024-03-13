const express = require('express');
const router = express.Router();
const commentDatabaseApi = require('../integration/CommentDatabaseApi');
const { getLoggedInUser } = require('../helpers/cacheHelpers');

const commentUrls = {
  updateComment: '/:id/update',
  deleteComment: '/:id/delete',
  replyComment: '/:id/reply',
};

// Register url to update comment
router.post(commentUrls.updateComment, async (req, res) => {
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

// Publish the routes and URL constants so other modules can use it
module.exports = {
  router,
  commentUrls,
};
