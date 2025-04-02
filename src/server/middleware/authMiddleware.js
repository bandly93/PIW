// src/server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key'; // Or use env vars

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ No token provided');
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.sendStatus(403);
  }
};


module.exports = authenticateToken;
