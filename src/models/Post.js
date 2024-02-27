const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    title: {type: String, maxLength: 255},
    photo: {type: String, maxLength: 255},
    description: {type: String, maxLength: 600}
});

module.exports = mongoose.model('Post', Post)