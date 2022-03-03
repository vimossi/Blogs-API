const Joi = require('@hapi/joi');
const { Categories } = require('../models/index');

const CategorySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.required': '"name" is required',
  }),
});

const create = async ({ name }) => {
  const { error } = CategorySchema.validate({ name });

  if (error) {
    return { status: 400, json: { message: error.details[0].message } };
  }

  const findCategory = await Categories.findOne({ where: { name } });

  if (findCategory) {
    return { status: 409, json: { message: 'Category already created' } };
  }

  const newCategory = await Categories.create({ name });

  return { status: 201, json: newCategory };
};

module.exports = {
  create,
};
