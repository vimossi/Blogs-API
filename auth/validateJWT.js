const jwt = require('jsonwebtoken');
const { Users } = require('../models/index');

const secret = 'secret_key';

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = jwt.verify(token, secret);

    const user = await Users.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User does not exist' });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};
