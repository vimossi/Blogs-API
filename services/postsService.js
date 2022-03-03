const Joi = require('@hapi/joi');
const { Op } = require('sequelize');
const { BlogPosts, Categories } = require('../models/index');

const PostSchema = Joi.object({
  userId: Joi.number(),
  title: Joi.string().required().messages({
    'string.required': '"title" is required',
  }),
  content: Joi.string().required().messages({
    'string.required': '"content" is required',
  }),
  categoryIds: Joi.array().items(Joi.number()).required().messages({
    'string.required': '"categoryId" is required',
  }),
});

const create = async ({ title, content, categoryIds, userId }) => {
  const { error } = PostSchema.validate({ title, content, categoryIds });

  if (error) {
    return { status: 400, json: { message: error.details[0].message } };
  }

  const categories = await Categories.findAll({
    where: {
      [Op.or]: categoryIds.map((categoryId) => ({
        id: categoryId,
      })),
    },
  });

  if (categories.length !== categoryIds.length) {
    return { status: 400, json: { message: '"categoryIds" not found' } };
  }

  const newPost = await BlogPosts.create({ userId, title, content, categoryIds });

  return { status: 201, json: newPost };
};

module.exports = {
  create,
};
