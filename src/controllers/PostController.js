const Post = require('../models/Post')

class PostController {
    getAllPosts(req, res) {
        Post.find({}).then(posts => {
            res.json(posts)
        }).catch(err => {
            res.status(500).json({error: 'ERROR!'})
        })
    }
}

module.exports = new PostController
