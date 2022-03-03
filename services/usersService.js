const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const { Users } = require('../models/index');

const RegisterSchema = Joi.object({
  displayName: Joi.string().min(8).required()
    .messages({ 'string.min': '"displayName" length must be at least 8 characters long' }),
  email: Joi.string().email().required()
    .messages({
      'string.email': '"email" must be a valid email',
      'string.required': '"email" is required',
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': '"password" length must be 6 characters long',
      'string.required': '"password" is required',
    }),
});

const secret = 'secret_key';

const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

const getUserByEmail = async (email) => {
  const myUser = await Users.findOne({ where: { email } });

  if (!myUser) {
    return { status: 404, message: 'User not found' };
  }

  const payload = { displayName: myUser.displayName, email: myUser.email, image: myUser.image };
  const token = jwt.sign(payload, secret, jwtConfig);

  return { status: 200, data: myUser, token };
};

const register = async ({ displayName, email, password, image }) => {
  const { error } = RegisterSchema.validate({ displayName, email, password });

  if (error) {
    return { status: 400, json: { message: error.details[0].message } };
  }

  const findUser = await Users.findOne({ where: { email } });

  if (findUser) {
    return { status: 409, json: { message: 'User already registered' } };
  }

  const newUser = await Users.create({
    displayName, email, password, image,
  });

  const payload = { displayName: newUser.displayName, email: newUser.email, image: newUser.image };
  const token = jwt.sign(payload, secret, jwtConfig);

  return { status: 201, json: { token } };
};

module.exports = {
  getUserByEmail,
  register,
};
