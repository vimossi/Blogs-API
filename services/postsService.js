const Joi = require('@hapi/joi');
const { Op } = require('sequelize');
const { BlogPosts, Categories, PostsCategories } = require('../models/index');

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

const PostUpdateSchema = Joi.object({
  userId: Joi.number(),
  title: Joi.string().required().messages({
    'string.required': '"title" is required',
  }),
  content: Joi.string().required().messages({
    'string.required': '"content" is required',
  }),
});

const getCategories = async (categoryIds) => {
  const categories = await Categories.findAll({
    where: {
      [Op.or]: categoryIds.map((categoryId) => ({
        id: categoryId,
      })),
    },
  });

  return categories;
};

const create = async ({ title, content, categoryIds, userId }) => {
  const { error } = PostSchema.validate({ title, content, categoryIds });

  if (error) {
    return { status: 400, json: { message: error.details[0].message } };
  }

  const categories = await getCategories(categoryIds);

  if (categories.length !== categoryIds.length) {
    return { status: 400, json: { message: '"categoryIds" not found' } };
  }

  const newPost = await BlogPosts.create({ userId, title, content, categoryIds });
  await Promise.all(categoryIds.map(
    (categoryId) => PostsCategories.create({ postId: newPost.id, categoryId }),
));

  return { status: 201, json: newPost };
};

const getCategoriesFromPost = async (postId) => {
  const categoryIdsData = await PostsCategories.findAll({
    where: {  
        postId,
      },
    });
  const categoryIds = categoryIdsData
    .map((categoryIdData) => categoryIdData.dataValues.categoryId);
  const categoriesData = await getCategories(categoryIds);
  const categories = categoriesData.map((categoryData) => ({ ...categoryData.dataValues }));
  return categories;
};

const getAll = async (user) => {
  const response = await BlogPosts.findAll();
  const blogPostsPromises = response.map(async (blogPost) => {
    const categories = await getCategoriesFromPost(blogPost.dataValues.id);

    const { id, title, content, userId, published, updated } = blogPost.dataValues;
    return { id, title, content, userId, published, updated, user, categories };
  });

  const blogPosts = await Promise.all(blogPostsPromises);
  return { status: 200, json: blogPosts };
};

const getOne = async ({ id, user }) => {
  const postData = await BlogPosts.findOne({ where: { id } });

  if (!postData) {
    return { status: 404, json: { message: 'Post does not exist' } };
  }

  const { title, content, userId, published, updated } = postData.dataValues;
  const categories = await getCategoriesFromPost(id);
  const post = {
    id: Number(id), title, content, userId, published, updated, user, categories,
  };

  return { status: 200, json: post };
};

const isUpdateValid = ({ title, content, categoryIds }) => {
  const { error } = PostUpdateSchema.validate({ title, content });

  if (error || categoryIds) {
    return { status: 400, 
      json: { message: categoryIds ? 'Categories cannot be edited' : error.details[0].message } };
  }

  return null;
};

const update = async ({ title, content, categoryIds, userId, id }) => {
  const validateObj = isUpdateValid({ title, content, categoryIds });
  if (validateObj) {
    return validateObj;
  }

  const postToUpdate = await BlogPosts.findOne({ where: { id } });
  if (Number(postToUpdate.dataValues.userId) !== Number(userId)) {
    return { status: 401, json: { message: 'Unauthorized user' } };
  }

  await BlogPosts.update({ title, content }, { where: { id } });
  const categories = await getCategoriesFromPost(id);
  const post = {
    title,
    content,
    userId: Number(userId),
    categories,
  };

  return { status: 200, json: post };
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
};
