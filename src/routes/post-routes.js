var express = require('express');
var router = express.Router();

/* 
Explain:
- We will use the router to create new route ('/') for post list page (it's the `post-collection.hbs`)
- In this route, we will get all posts in the database and bind the value to `post-collection.hbs`
- We get the mongodb instance that is created by `monk` in `main.js`
- We query all posts and bind it to page by using render() function
*/

/* READ, UPDATE, DELETE posts */
router.get('/', function(req, res) {
	const db = req.db;
	const postCollection = db.get("posts");
	postCollection.find({}, {}, function(e, docs) {
		res.render('pages/post/post-collection', {'posts' : docs});
	});
});

module.exports = router