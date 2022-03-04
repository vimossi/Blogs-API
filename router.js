const express = require('express');

const router = express.Router();

const { validateJWT } = require('./auth');
const Users = require('./controllers/usersController');
const Posts = require('./controllers/postsController');
const Categories = require('./controllers/categoriesController');

router.post('/user', Users.register);
router.post('/login', Users.login);
router.get('/user', validateJWT, Users.getAll);
router.get('/user/:id', validateJWT, Users.getOne);

router.post('/categories', validateJWT, Categories.create);
router.get('/categories', validateJWT, Categories.getAll);

router.post('/post', validateJWT, Posts.create);
router.get('/post', validateJWT, Posts.getAll);
router.get('/post/:id', validateJWT, Posts.getOne);
router.put('/post/:id', validateJWT, Posts.update);
router.delete('/post/:id', validateJWT, Posts.deleteOne);
router.delete('/user/me', validateJWT, Users.deleteOne);

module.exports = router;
