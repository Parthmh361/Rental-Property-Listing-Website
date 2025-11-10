const jwt = require('jsonwebtoken');

function generateToken(id) {
  const secret = process.env.JWT_SECRET || 'changeme';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
}

module.exports = generateToken;
