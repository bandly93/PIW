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
  const userId = req.user.id;

  const where = { userId };

  if (type) {
    where.type = type;
  }

  if (date) {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59.999`);
    where.date = {
      [Op.between]: [startOfDay, endOfDay],
      
    };
  }
  
  try {
    const logs = await Log.findAll({ where, order: [['createdAt', 'DESC']] });
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
