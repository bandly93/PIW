const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const { Op } = require('sequelize');

// Helper: Get LOCAL date string (YYYY-MM-DD)
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get completed tasks for today, week, and month
router.get('/tasks-stats', async (req, res) => {
  try {
    // Get today's date in LOCAL YYYY-MM-DD format
    const today = new Date();
    const todayString = getLocalDateString(today);

    // Get week start (Sunday) in LOCAL YYYY-MM-DD format
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartString = getLocalDateString(weekStart);

    // Get month start in LOCAL YYYY-MM-DD format
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartString = getLocalDateString(monthStart);

    // Today's tasks (exclude type 'Meal')
    const completedToday = await Task.count({
      where: {
        completed: true,
        date: todayString,
        type: { [Op.ne]: 'Meal' },
      },
    });

    const totalTasksToday = await Task.count({
      where: {
        date: todayString,
        type: { [Op.ne]: 'Meal' },
      },
    });

    // This week's tasks (exclude type 'Meal')
    const completedWeek = await Task.count({
      where: {
        completed: true,
        date: { [Op.gte]: weekStartString },
        type: { [Op.ne]: 'Meal' },
      },
    });

    const totalTasksWeek = await Task.count({
      where: {
        date: { [Op.gte]: weekStartString },
        type: { [Op.ne]: 'Meal' },
      },
    });

    // This month's tasks (exclude type 'Meal')
    const completedMonth = await Task.count({
      where: {
        completed: true,
        date: { [Op.gte]: monthStartString },
        type: { [Op.ne]: 'Meal' },
      },
    });

    const totalTasksMonth = await Task.count({
      where: {
        date: { [Op.gte]: monthStartString },
        type: { [Op.ne]: 'Meal' },
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