var express = require('express');
const PostDatabaseApi = require('../integration/PostDatabaseApi');
const CategoryDatabaseApi = require('../integration/CategoryDatabaseApi');
var router = express.Router();

router.get('/', async (req, res) => {
	const { category_id } = req.query;
	let categories = [];
	await CategoryDatabaseApi.findAll().then((result) => {
		categories = result
	});
	const renderPost = (posts) => {
		res.render('post-collection', {posts: posts, categories: categories});
	}

	if (category_id) {
		PostDatabaseApi.findByCategory(category_id).then(renderPost);
	} else {
		PostDatabaseApi.findAll().then(renderPost);
	}
});

module.exports = router