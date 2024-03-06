const db = require('./db')
const postCollection = db.get('posts')
const { ITEMS_PER_PAGE } = require('./constant')

const queryPosts = async (queryPipleline, page = 1) => {
  const start = (page - 1) * ITEMS_PER_PAGE
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

  const aggregationPipelineForQueryPosts = aggregationPipeline.concat([
    {
      $skip: start,
    },
    {
      $limit: ITEMS_PER_PAGE,
    },
  ])

  const aggregationPipelineForCount = aggregationPipeline.concat([
    {
      $count: 'totalItems',
    },
  ])

  const [totalCount] = await postCollection.aggregate(aggregationPipelineForCount)
  const totalItems = totalCount ? totalCount.totalItems : 0

  const posts = await postCollection.aggregate(aggregationPipelineForQueryPosts)

  return { posts, totalItems }
}

module.exports = {
  async findAll(page) {
    return await queryPosts(undefined, page)
  },
  async findByCategoryAndSearchKey(categoryId, searchKey, sortBy, page) {
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

    return await queryPosts(queryPipeline, page)
  },
}
