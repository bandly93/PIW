const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = (req, res, next) => {
  console.log('🔐 Checking token for route:', req.method, req.originalUrl);

  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('❌ Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
