const express = require('express');

const router = express.Router();

const Users = require('./controllers/usersController');

router.post('/user', Users.register);
router.post('/login', Users.login);

module.exports = router;
