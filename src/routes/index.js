const postRouter = require('./postRoutes')

function route(app) {
    app.use('/views', postRouter)
}

module.exports = route;
