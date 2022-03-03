const Posts = require('../services/postsService');

const create = async (req, res) => {
  const { title, content, categoryIds } = req.body;
  const { user } = req;
  const response = await Posts.create({ title, content, categoryIds, userId: user.dataValues.id }); 
  return res.status(response.status).json(response.json);
};

const getAll = async (req, res) => {
  const { user } = req;
  const response = await Posts.getAll(user.dataValues); 
  return res.status(response.status).json(response.json);
};

module.exports = {
  create,
  getAll,
};
