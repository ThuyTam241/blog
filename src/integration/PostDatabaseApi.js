const db = require('./db')
const postCollection = db.get('posts')

const queryPosts = async (queryPipleline) => {
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
      $addFields: {
        category: { $arrayElemAt: ['$category', 0] },
      },
    },
  ]

  if (queryPipleline) {
    aggregationPipeline.unshift(...queryPipleline)
  }

  return await postCollection.aggregate(aggregationPipeline)
}

module.exports = {
  async findAll() {
    return await queryPosts(undefined)
  },
  async findByCategoryAndSearchKey(categoryId, searchKey, sortBy) {
    let queryPipeline = []
    if (categoryId) {
      queryPipeline.unshift({ $match: { category_id: categoryId } })
    }
    if (searchKey) {
      queryPipeline.unshift({
        $match: {
          $or: [
            { title: { $regex: searchKey, $options: 'i' } },
            { description: { $regex: searchKey, $options: 'i' } },
          ],
        },
      })
    }
    if (sortBy) {
      queryPipeline.unshift({ $sort: { [sortBy]: 1 } })
    }

    return await queryPosts(queryPipeline)
  },
}
