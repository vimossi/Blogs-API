const express = require('express');

const router = express.Router();

const { validateJWT } = require('./auth');
const Users = require('./controllers/usersController');

router.post('/user', Users.register);
router.post('/login', Users.login);
router.get('/user', validateJWT, Users.getAll);
router.get('/user/:id', validateJWT, Users.getOne);

module.exports = router;
