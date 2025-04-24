const express = require('express');
const router = express.Router();
const { Planner } = require('../models');

// GET /api/planners?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { date } = req.query;
  try {
    const planner = await Planner.findOne({ where: { date } });
    if (!planner) return res.status(404).send('Not found');
    res.json(planner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/planners
router.post('/', async (req, res) => {
  const { date } = req.body;
  try {
    const planner = await Planner.create({ date });
    res.status(201).json(planner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
