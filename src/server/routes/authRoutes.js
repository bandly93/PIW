const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';



// GET: simple test route
router.get('/test', (_req, res) => {
  console.log('✅ /api/test route hit');
  res.json({ message: 'It works!' });
});

// POST: /login
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  console.log('🛂 Login request received:', req.body);

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: { id: user.id, email },
    });
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST: /register
const registerHandler = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: { id: user.id, email },
    });
  } catch (err) {
    console.error('🔥 Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = router;


router.post('/login', loginHandler);
router.post('/register', registerHandler);
