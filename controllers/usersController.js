const Users = require('../services/usersService');

const register = async (req, res) => {
  const { displayName, email, password, image } = req.body;
  const response = await Users.register({ displayName, email, password, image }); 
  return res.status(response.status).json(response.json);
};

module.exports = {
  register,
};
