const monk = require('monk');
const db = monk('mongodb://localhost:27017/blogDB');

module.exports = db;
