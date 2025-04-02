const express = require('express');
const { Log } = require('../models');
const verifyToken = require('../middleware/authMiddleware');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Protect everything below with JWT
router.use(verifyToken);

router.get('/', authenticateToken, async (req, res) => {
  try {
    const logs = await Log.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });
    res.json(logs);
  } catch (err) {
    console.error('Sequelize error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const newLog = await Log.create({ ...req.body, userId: req.user.id });
  res.status(201).json(newLog);
});

module.exports = router;
