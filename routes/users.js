var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
var models = require('../models');
const authService = require("../services/auth");

// Register
// http://localhost:3001/users/signup
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
        res.json({
          message: 'User successfully created!',
          status: 200
        });
      } else {
        res.json({
          message: "that user already exists",
          status: 403,
        });
      }
    });
});

// PROFILE PAGE
// http://localhost:3001/users/profile
router.get('/profile', function (req, res, next) {
  let myToken = req.headers.authorization;
  console.log(myToken);

  if (myToken) {
    let currentUser = authService.verifyUser(myToken);
    console.log(currentUser);

    if (currentUser) {
      let responseUser = {
        fullName: currentUser.fullName,
        email: currentUser.email,
        username: currentUser.username
      }
      res.json({
        message: "User Profile loaded successfully!",
        status: 200,
        user: responseUser
      })
    } else {
      res.json({
        message: "Token was invalid or expired!",
        status: 403
      })

    }
  } else {
    res.json({
      message: "No token received!",
      status: 403
    })
  }

});



// Login Route
// http://localhost:3001/users/login
router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username
    }
  }).then(user => {
    if (!user) {
      console.log('User not found')
      return res.status(401).json({
        message: "Login Failed"
      });
    } else {
      let passwordMatch = authService.comparePasswords(req.body.password, user.Password);
      if (passwordMatch) {
        let token = authService.signUser(user);
        res.json({
          message: 'User successfully logged in!',
          status: 200,
          token
        });
      } else {
        console.log('Wrong password');
        res.send('Wrong password');
      }
    }
  });
});


// Logout Route
// http://localhost:3001/users/logout
router.get('/logout', function (req, res, next) {
  res.cookie('jwt', "", { expires: new Date(0) });
  res.json({
    message: 'User successfully logged out!',
    status: 200
  });
});

module.exports = router;