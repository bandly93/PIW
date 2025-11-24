// src/server/routes/logRoutes.js
const express = require('express');
const { Log } = require('../models');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();
const { Op } = require('sequelize');

// Protect routes
router.use(verifyToken);

// GET logs
router.get('/', async (req, res) => {
  const { type, date, from, to } = req.query;
  const userId = req.user.id;

  const where = { userId };

  if (type) where.type = type;
  if (date) where.date = date;
  if (from && to) {
    where.date = { [Op.between]: [from, to] };
  }

  try {
    const logs = await Log.findAll({ where });
    return res.json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// CREATE log
router.post('/', async (req, res) => {
  try {
    const newLog = await Log.create({ ...req.body, userId: req.user.id });
    res.status(201).json(newLog);
  } catch (err) {
    console.error('Error creating log:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE log 🔥 (new)
router.put('/:id', async (req, res) => {
  try {
    const log = await Log.findByPk(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });

    const { details, calories, type, date } = req.body;

    await log.update({
      details: details ?? log.details,
      calories: calories ?? log.calories,
      type: type ?? log.type,
      date: date ?? log.date,
    });

    return res.json(log);
  } catch (err) {
    console.error('Error updating log:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
