const Categories = require('../services/categoriesService');

const create = async (req, res) => {
  const { name } = req.body;
  const response = await Categories.create({ name }); 
  return res.status(response.status).json(response.json);
};

const getAll = async (req, res) => {
  const response = await Categories.getAll(); 
  return res.status(response.status).json(response.json);
};

module.exports = {
  create,
  getAll,
};
