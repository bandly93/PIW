const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const { Op } = require('sequelize');

// Get completed tasks for today, week, and month
router.get('/tasks-stats', async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Get week start (Sunday) in YYYY-MM-DD format
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartString = weekStart.toISOString().split('T')[0];

    // Get month start in YYYY-MM-DD format
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartString = monthStart.toISOString().split('T')[0];

    // Today's tasks (exclude type 'Meal')
    const completedToday = await Task.count({
      where: {
        completed: true,
        date: todayString,
        type: { [Op.ne]: 'Meal' }, // 🔽 Exclude meals
      },
    });

    const totalTasksToday = await Task.count({
      where: {
        date: todayString,
        type: { [Op.ne]: 'Meal' }, // 🔽 Exclude meals
      },
    });

    // This week's tasks (exclude type 'Meal')
    const completedWeek = await Task.count({
      where: {
        completed: true,
        date: { [Op.gte]: weekStartString },
        type: { [Op.ne]: 'Meal' }, // 🔽 Exclude meals
      },
    });

    const totalTasksWeek = await Task.count({
      where: {
        date: { [Op.gte]: weekStartString },
        type: { [Op.ne]: 'Meal' }, // 🔽 Exclude meals
      },
    });

    // This month's tasks (exclude type 'Meal')
    const completedMonth = await Task.count({
      where: {
        completed: true,
        date: { [Op.gte]: monthStartString },
        type: { [Op.ne]: 'Meal' }, // 🔽 Exclude meals
      },
    });

    const totalTasksMonth = await Task.count({
      where: {
        date: { [Op.gte]: monthStartString },
        type: { [Op.ne]: 'Meal' }, // 🔽 Exclude meals
      },
    });

    res.json({
      completedToday,
      totalTasksToday,
      completedWeek,
      totalTasksWeek,
      completedMonth,
      totalTasksMonth,
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
});

module.exports = router;