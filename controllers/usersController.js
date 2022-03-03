const Users = require('../services/usersService');

const register = async (req, res) => {
  const { displayName, email, password, image } = req.body;
  const response = await Users.register({ displayName, email, password, image }); 
  return res.status(response.status).json(response.json);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const response = await Users.login({ email, password }); 
  return res.status(response.status).json(response.json);
};

const getAll = async (req, res) => {
  const response = await Users.getAll(); 
  return res.status(response.status).json(response.json);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const response = await Users.getOne(id);
  return res.status(response.status).json(response.json);
};

module.exports = {
  register,
  login,
  getAll,
  getOne,
};
