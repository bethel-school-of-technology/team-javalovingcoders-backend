var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models');
var passport = require('passport');
var session = require('express-session');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
const authService = require('./services/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors({ origin: "http://localhost:4200" }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'perilous journey' }));
app.use(passport.initialize());
app.use(passport.session());

// Authenticating a User! / I know who you are now! :)
app.use(async (req, res, next) => {
  // get token from the request
  const header = req.headers.authorization;

  if (!header) {
    return next();
  }

  const token = header.split(' ')[1];

  // validate token / get the user
  const user = await authService.verifyUser(token);
  req.user = user;
  next();

});

// Authorizing a User! / You have been idenified but you do not have permission to do that! :(

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

models.sequelize.sync().then(function () {
  console.log("DB has Sync'd up")
});


module.exports = app;
