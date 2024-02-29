const db = require('./db');
const userCollection = db.get('users');

class UserDatabaseApi {
    static async addUser(user) {
        return await userCollection.insert(user);
    }

    static async getUserByUsername(username) {
        return await userCollection.findOne({ username: username });
    }
}

module.exports = UserDatabaseApi;