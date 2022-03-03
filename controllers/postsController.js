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

const getOne = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const response = await Posts.getOne({ id, user: user.dataValues });
  return res.status(response.status).json(response.json);
};

const update = async (req, res) => {
  const { title, content, categoryIds } = req.body;
  const { user } = req;
  const { id } = req.params;
  const response = await Posts
    .update({ title, content, categoryIds, userId: user.dataValues.id, id }); 
  return res.status(response.status).json(response.json);
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
};
