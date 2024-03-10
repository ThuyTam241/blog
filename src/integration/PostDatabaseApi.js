const db = require('./db');
const postCollection = db.get('posts');
const categoryCollection = db.get('categories');
const userCollection = db.get('users');
const commentCollection = db.get('comments');
const { ITEMS_PER_PAGE } = require('./constant');

const queryPosts = async (queryPipleline, page = 1) => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  let aggregationPipeline = [
    {
      $lookup: {
        from: 'categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author_id',
        foreignField: '_id',
        as: 'author',
      },
    },
    {
      $addFields: {
        category: { $arrayElemAt: ['$category', 0] },
        author: { $arrayElemAt: ['$author', 0] },
      },
    },
  ];

  if (queryPipleline) {
    aggregationPipeline.unshift(...queryPipleline);
  }

  const aggregationPipelineForQueryPosts = aggregationPipeline.concat([
    {
      $skip: start,
    },
    {
      $limit: ITEMS_PER_PAGE,
    },
  ]);

  const aggregationPipelineForCount = aggregationPipeline.concat([
    {
      $count: 'totalItems',
    },
  ]);

  const [totalCount] = await postCollection.aggregate(aggregationPipelineForCount);
  const totalItems = totalCount ? totalCount.totalItems : 0;

  const posts = await postCollection.aggregate(aggregationPipelineForQueryPosts);

  return { posts, totalItems };
};

module.exports = {
  async findAll(page) {
    return await queryPosts(undefined, page);
  },
  async findByCategoryAndSearchKey(categoryId, searchKey, sortBy, page) {
    let queryPipeline = [];
    if (categoryId) {
      queryPipeline.unshift({ $match: { category_id: categoryId } });
    }
    if (searchKey) {
      queryPipeline.unshift({
        $match: {
          $or: [
            { title: { $regex: searchKey, $options: 'i' } },
            { description: { $regex: searchKey, $options: 'i' } },
          ],
        },
      });
    }
    if (sortBy) {
      queryPipeline.unshift({ $sort: { [sortBy]: 1 } });
    }

    return await queryPosts(queryPipeline, page);
  },
  async findById(postId) {
    const post = await postCollection.findOne({ _id: postId });
    const category = await categoryCollection.findOne({ _id: post.category_id });
    const author = await userCollection.findOne({ _id: post.author_id });
    const comments = await commentCollection.aggregate([
      { $match: { _id: { $in: post.comments } } },
      { $sort: { created_date: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
        },
      },
    ]);

    return { post, category, author, comments };
  },
  async likePost(postId, userId) {
    const post = await postCollection.findOne({ _id: postId });
    if (!post) {
      throw new Error('Post not found');
    }

    const likesIndex = post.likes.map((id) => id.toString()).includes(userId.toString());
    if (likesIndex) {
      await postCollection.update({ _id: postId }, { $pull: { likes: userId } });
    } else {
      await postCollection.update({ _id: postId }, { $push: { likes: userId } });
    }
  },
  async commentPost(postId, userId, content) {
    const post = await postCollection.findOne({ _id: postId });
    if (!post) {
      throw new Error('Post not found');
    }

    const newComment = await commentCollection.insert({
      post_id: postId,
      user_id: userId,
      content,
      created_date: Date.now(),
    });
    await postCollection.update({ _id: postId }, { $push: { comments: newComment._id } });
  },
};
