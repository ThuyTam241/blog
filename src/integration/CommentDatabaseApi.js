const { ObjectId } = require('mongodb');
const db = require('./db');
const commentCollection = db.get('comments');

module.exports = {
  async updateComment(_id, user_id, content) {
    if (!_id || !content) {
      throw new Error('Bad request');
    }

    return await commentCollection.findOneAndUpdate(
      { _id: new ObjectId(_id), user_id: new ObjectId(user_id) },
      { $set: { content } },
    );
  },
  async deleteComment(_id, user_id) {
    if (!_id || !user_id) {
      throw new Error('Bad request');
    }

    return await commentCollection.findOneAndDelete({
      _id: new ObjectId(_id),
      user_id: new ObjectId(user_id),
    });
  },
  async replyComment(_id, user_name, content) {
    console.log("🚀 ~ replyComment ~ _id, user_name, content:", _id, user_name, content)
    if (!_id || !user_name || !content) {
      throw new Error('Bad request');
    }
    const replyingComment = {
      user: user_name,
      content,
      created_date: Date.now(),
    };

    return await commentCollection.findOneAndUpdate(
      { _id },
      { $push: { repliedComments: replyingComment } },
      { returnOriginal: false },
    );
  },
};
