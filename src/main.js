const express = require('express')
const { engine } = require('express-handlebars')
const morgan = require('morgan')
const app = express()
const port = 3000
const path = require('path')
// const route = require('./routes/index')
// route(app)

const db = require('../config/databaseConfig')
db.connect()

app.use(morgan('combined'))

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, './views'))

app.use(express.static(path.join(__dirname, './public')))

app.get('/', (req, res) => {
  res.render('home');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})