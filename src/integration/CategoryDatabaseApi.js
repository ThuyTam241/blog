const db = require('./db')
const categoryCollection = db.get('categories')

module.exports = {
  async findAll() {
    return await categoryCollection.find({})
  },
}
