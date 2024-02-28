const db = require('./db');
const categoryCollection = db.get('categories');

class CategoryDatabaseApi {

    static async findAll() {
        return await categoryCollection.find({});
    }

    static async loadCategoriesForPosts(posts) {
        this.findAll().then((categories) => {
            posts.forEach((post) => {
                post.category = categories.find((cat) => cat._id === post.category_id)
            })
        });
    }
}

module.exports = CategoryDatabaseApi;