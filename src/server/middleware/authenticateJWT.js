const jwt = require('jsonwebtoken');

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'your-secret-key', (err, user) => {
      if (err) return res.sendStatus(403);
      (req).user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
