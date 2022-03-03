const express = require('express');

const router = express.Router();

const { validateJWT } = require('./auth');
const Users = require('./controllers/usersController');
const Categories = require('./controllers/categoriesController');

router.post('/user', Users.register);
router.post('/login', Users.login);
router.get('/user', validateJWT, Users.getAll);
router.get('/user/:id', validateJWT, Users.getOne);

router.post('/categories', validateJWT, Categories.create);
router.get('/categories', validateJWT, Categories.getAll);

module.exports = router;
