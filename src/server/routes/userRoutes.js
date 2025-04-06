const express = require('express');
const { Log } = require('../models');
const verifyToken = require('../middleware/authMiddleware');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();
const { Op } = require('sequelize');
const { User } = require('../models')

// Protect everything below with JWT
router.use(verifyToken);

router.get('/goals', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatsGoal: user.fatsGoal,
      calorieGoal: user.calorieGoal,
    });
  } catch (err) {
    console.error('Error fetching user goals:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
