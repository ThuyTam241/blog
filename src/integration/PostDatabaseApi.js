const db = require('./db');
const postCollection = db.get('posts');
const CategoryDatabaseApi = require('./CategoryDatabaseApi');

class PostDatabaseApi {

    static async findAll() {
        let posts = [];
        await postCollection.find({}).then((result) => {
            posts = result;
        });
        await CategoryDatabaseApi.loadCategoriesForPosts(posts);
        return posts;
    }

    static async findByCategory(category_id) {
        let posts = [];
        await postCollection.find({ category_id }).then((result) => {
            posts = result;
        });
        await CategoryDatabaseApi.loadCategoriesForPosts(posts);
        return posts;
    }

    static async search(query) {
        return await postCollection.find({ $text: { $search: query } });
    }
}

module.exports = PostDatabaseApi;
