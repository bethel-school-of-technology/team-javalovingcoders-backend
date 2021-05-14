var express = require('express');
var router = express.Router();
var models = require('../models');
const authService = require("../services/auth");


// Create a Post
router.post('/createPost', function (res, req, next) {
    let token = req.headers.authorization;
    console.log(token);

    if (token) {
        let currentPost = authService.verifyUser(token);
        console.log(currentPost);

        if (currentPost) {
            models.posts.findOrCreate({
                where: { PostTitle: req.body.PostTitle },
                default: {
                    postBody: req.body.postBody,
                    category: req.body.category
                }
            }).spread(function (result, created) {
                if (created) {
                    res.json({
                        message: 'Post successfully created!',
                        status: 200
                    });
                } else {
                    res.json({ status: 403 });
                }
            });
        } else {
            res.json({
                message: 'Invalid User Authenitcation!',
                status: 403
            })
        }
    } else {
        res.json({
            message: 'Must be logged in for that!',
            status: 401
        })
    }
});


// Page for All Posts
router.get('/', function (res, req, next) {

});

module.exports = router;
