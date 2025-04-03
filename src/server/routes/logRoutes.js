const express = require('express');
const { Log } = require('../models');
const verifyToken = require('../middleware/authMiddleware');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();
const { Op } = require('sequelize');

// Protect everything below with JWT
router.use(verifyToken);
router.get('/', authenticateToken, async (req, res) => {
  const { type, date, from, to } = req.query;

  console.log('does it reach here')
  const userId = req.user.id;

  const where = { userId };

  if (type) {
    where.type = type;
  }

  if (date) {
    where.date = date; // 👈 Exact match for the selected day
  } else if (from && to) {
    where.date = { [Op.between]: [from, to] };
  }

  try {
    const logs = await Log.findAll({ where });
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





router.post('/', async (req, res) => {
  const newLog = await Log.create({ ...req.body, userId: req.user.id });
  res.status(201).json(newLog);
});

module.exports = router;
