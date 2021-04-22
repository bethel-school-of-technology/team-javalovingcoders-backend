var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
var models = require('../models');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username
      },
      defaults: {
        FullName: req.body.fullName,
        Email: req.body.email,
        Password: req.body.password
      }
    })
    .spread(function (result, created) {
      if (created) {
        res.redirect('login');
      } else {
        res.send('This user already exists');
      }
    });
});

/* GET profile page. */
router.get('/profile/:id', function (req, res, next) {
  models.users
    .findByPk(parseInt(req.params.id))
    .then(user => {
      if (user) {
        res.render('profile', {
          FullName: user.FullName,
          Email: user.Email,
          Username: user.Username
        });
      } else {
        res.send('User not found');
      }
    });
});

/* POST login page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  models.users
    .findOne({
      where: {
        Username: req.body.username,
        Password: req.body.password
      }
    })
    .then(user => {
      if (user) {
        res.redirect('profile/' + user.UserId);
      } else {
        res.send('Invalid login!');
      }
    });
});

module.exports = router;