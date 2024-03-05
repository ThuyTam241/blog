const db = require('./db')
const userCollection = db.get('users')

module.exports = {
  async addUser(user) {
    return await userCollection.insert(user)
  },
  async findByUsername(username) {
    return await userCollection.findOne({ username })
  },
  async findByUsernameAndPassword(username, password) {
    return await userCollection.findOne({ username, password })
  },
}
