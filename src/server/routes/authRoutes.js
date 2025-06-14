const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRESIN = process.env.JWT_EXPIRESIN
const authenticateToken = require('../middleware/authMiddleware')

// POST: /login
const loginHandler = async (req, res) => {
  const { email, password } = req.body; 

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRESIN });

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
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      calorieGoal: 2000,
      proteinGoal: 150,
      carbGoal: 200,
      fatGoal: 70,
    });    

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRESIN });

    res.status(201).json({
      token,
      user: { id: user.id, email },
    });
  } catch (err) {
    console.error('🔥 Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

router.post('/login', loginHandler);
router.post('/register', registerHandler);

// 👇 protect everything after this line
router.use(authenticateToken);

module.exports = router;

