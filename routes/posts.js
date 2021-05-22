var express = require('express');
var router = express.Router();
const { posts } = require('../models/');
const { users } = require('../models/');
var models = require('../models')
const authService = require("../services/auth");


// CREATE a Post // POST Method
// http://localhost:3001/posts/createPost
router.post('/createPost', async function (req, res, next) {

    const user = req.user;

    if (!user) {
        res.status(403).send();
        return;
    }

    posts.create({
        PostTitle: req.body.postTitle,
        PostBody: req.body.postBody,
        Category: req.body.category,
        UserId: user.UserId
    }).then(newPost => { res.json(newPost); })
        .catch(() => { res.status(400).send(); })
});


// GET All Posts // GET Method
// http://localhost:3001/posts
router.get('/', function (req, res, next) {
    posts.findAll({ include: [{ model: users }] })
        .then(postsFound => {
            res.json({
                message: postsFound,
                status: 200
            });
        })
});


// GET A Single POST // GET Method
// http://localhost:3001/posts/:id
router.get('/:PostTitle', (req, res, next) => {
    const testId = (req.body.PostTitle)

    posts.findOne({
        where: { PostId: testId }
    })
        .then(thePost => {
            if (thePost) { res.json(thePost); }
            else { res.status(404).send(); }
        }), err => {
            res.status(500).send(err)
        }
});


// UPDATE a post // PUT Method
// http://localhost:3001/posts/:id
router.put('/update', async function (req, res, next) {
    const testId = parseInt(req.body.PostId);

    if (!testId || testId <= 0) {
        res.status(400).send('Invalid ID');
        return
    }

    const user = req.user;

    if (!user) {
        res.status(403).send();
        return;
    }

    posts.update({
        PostTitle: req.body.postTitle,
        PostBody: req.body.postBody,
        Category: req.body.category
    }).then(updatedPost => { res.json(updatedPost); })
    .catch(() => { res.status(400).send(); })
});



// DELETE A Post // DELETE Method
// http://localhost:3001/posts/delete
router.delete('/delete', async function (req, res, next) {

    const user = req.user;

    if (!user) {
        res.status(403).send();
        return;
    }

    posts.destroy({ where: { PostId: req.body.id } })
        .then(() => { res.status(204).send(); })
        .catch(() => { res.status(400).send() });
});



module.exports = router;
