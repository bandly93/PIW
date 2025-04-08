const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Error:', err);
      return res.status(401).json({ message: 'Token expired' }); // ✅ Ensure 401
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
