const express = require('express')
const { engine } = require('express-handlebars');
const path = require('path')  
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');

const routes = require('./routes/index');
const postRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');

const port = 3000;

// Set the view engine to use handlebars
app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ...
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Register routes
app.use('/', routes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(err.status || 500);
  res.render('error', {
      message: err,
      error: {}
  });
});

app.listen(port, () => {
  console.log(`Personal Blog System are listening on port ${port}`)
})