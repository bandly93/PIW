const express = require('express');
const router = express.Router();
const { Planner } = require('../models');

// Make sure you apply authentication middleware before these routes
// Example: router.use(requireUser);

// GET /api/planners?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { date } = req.query;
  try {
    const userId = req.user.id;

    const planner = await Planner.findOne({
      where: { date, userId },
    });

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
    const userId = req.user.id;

    let planner = await Planner.findOne({ where: { date, userId } });

    if (!planner) {
      planner = await Planner.create({ date, userId });
    }

    res.status(201).json(planner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
