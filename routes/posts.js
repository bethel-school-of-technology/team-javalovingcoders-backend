var express = require('express');
var router = express.Router();
var models = require('../models');
const authService = require("../services/auth");


// Create a Post
// http://localhost:3001/posts/createPost
router.post('/createPost', async function (req, res, next) {
    let token = req.headers.authorization;
    console.log(token);

    if (token) {
        let currentUser = await authService.verifyUser(token);
        console.log(currentUser);

        if (currentUser) {
            models.posts.findOrCreate({
                where: { PostTitle: req.body.postTitle },
                defaults: {
                    PostBody: req.body.postBody,
                    Category: req.body.category,
                    UserId: currentUser.UserId
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
// http://localhost:3001/posts
router.get('/', function (req, res, next) {
    models.posts
        .findAll({ include: [{ model: models.users }] })
        .then(postsFound => {
            res.json({
                message: postsFound,
                status: 200
            });
        })
});

module.exports = router;
