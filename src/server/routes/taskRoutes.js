const express = require('express');
const router = express.Router();
const { Planner, Task } = require('../models');
const { Op } = require('sequelize');

// GET tasks by planner date
router.get('/', async (req, res) => {
  const { date } = req.query;

  try {
    const planner = await Planner.findOne({
      where: { date },
      include: {
        model: Task,
        as: 'tasks',
        order: [['order', 'ASC']], // Ensure tasks are ordered by the `order` field
      },
    });

    if (!planner) {
      return res.json([]); // No planner means no tasks
    }

    return res.json(planner.tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// POST new task
router.post('/', async (req, res) => {
  const { text, type, notes, completed, plannerId } = req.body;

  if (!plannerId) {
    return res.status(400).json({ error: 'plannerId is required' });
  }

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task name cannot be empty' });
  }

  try {
    // Determine the current number of tasks to set the `order` field
    const taskCount = await Task.count({ where: { plannerId } });

    const task = await Task.create({
      text,
      type,
      notes,
      completed,
      plannerId,
      order: taskCount, // Set the order based on the current task count
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// PUT update a task
router.put('/:id', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task name cannot be empty' });
  }

  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).send('Task not found');

    await task.update(req.body);
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// PUT reorder tasks
router.put('/reorder', async (req, res) => {
  console.log('Reorder payload:', req.body); // Log the incoming payload

  const { tasks } = req.body;

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: 'Invalid tasks format' });
  }

  try {
    const updatePromises = tasks.map((task) =>
      Task.update({ order: task.order }, { where: { id: task.id } })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return res.status(500).json({ error: error.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).send('Task not found');

    await task.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
