var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
var models = require('../models');
const authService = require("../services/auth");


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Create a new user if one doesn't exist
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
        Password: authService.hashPassword(req.body.password)
      }
    })
    .spread(function (result, created) {
      if (created) {
        res.send('User Successfully Created!');
      } else {
        res.send('This user already exists');
      }
    });
});

// Loin user and return JWT as cookie
router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username,
      Password: req.body.password
    }
  }).then(user => {
    if (!user) {
      console.log('User not found')
      return res.status(401).json({
        message: "Login Failed"
      });
    }
    if (user) {
      let token = authService.signUser(user);
      res.cookie('jwt', token);
      res.send('Login successful');
    } else {
      console.log('Wrong password');
      res.redirect('login')
    }
  });
});

router.get('/profile', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          res.send(JSON.stringify(user));
        } else {
          res.status(401);
          res.send('Invalid authentication token');
        }
      });
  } else {
    res.status(401);
    res.send('Must be logged in');
  }
});

router.get('/logout', function (req, res) {
  router.get('/logout', function (req, res, next) {
    res.cookie('jwt', "", { expires: new Date(0) });
    res.send('Logged out');
  });
});

module.exports = router;