const { Router } = require('express');
// import { authenticateJWT } from '../middleware/auth'; // if you’re using JWT
const { Log } = require('../models'); // Sequelize model

const router = Router();

router.get('/', async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [['date', 'DESC']],
    });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { date, type, details, calories } = req.body;

    // Optionally get userId from req.user if using JWT
    const log = await Log.create({
      // userId: req.user.id,
      date,
      type,
      details,
      calories,
    });

    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
