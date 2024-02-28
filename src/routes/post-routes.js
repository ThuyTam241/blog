var express = require('express');
const PostDatabaseApi = require('../integration/PostDatabaseApi');
const CategoryDatabaseApi = require('../integration/CategoryDatabaseApi');
var router = express.Router();

/* 
Explain:
- We will use the router to create new route ('/') for post list page (it's the `post-collection.hbs`)
- In this route, we will get all posts in the database and bind the value to `post-collection.hbs`
- We get the mongodb instance that is created by `monk` in `main.js`
- We query all posts and bind it to page by using render() function
*/

/* READ, UPDATE, DELETE posts */
router.get('/', async (req, res) => {
	const { category_id } = req.query;
	let categories = [];
	await CategoryDatabaseApi.findAll().then((result) => {
		categories = result
	});
	const renderPost = (posts) => {
		res.render('pages/post/post-collection', {posts: posts, categories: categories});
	}

	if (category_id) {
		PostDatabaseApi.findByCategory(category_id).then(renderPost);
	} else {
		PostDatabaseApi.findAll().then(renderPost);
	}
});

module.exports = router