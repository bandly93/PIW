const express = require('express');
const router = express.Router();
const { Planner, Task } = require('../models');
const { Op } = require('sequelize');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET tasks by planner (date + plannerId); planner must belong to current user
router.get('/', async (req, res) => {
  const { date, plannerId } = req.query;

  if (!plannerId) {
    return res.status(400).json({ error: 'plannerId is required' });
  }

  try {
    const planner = await Planner.findOne({
      where: { id: plannerId, userId: req.user.id },
      include: {
        model: Task,
        as: 'tasks',
        order: [['order', 'ASC']],
      },
    });

    if (!planner) {
      return res.json([]);
    }

    return res.json(planner.tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// POST new task (planner must belong to current user)
router.post('/', async (req, res) => {
  const { text, type, notes, completed, plannerId, logId, date } = req.body;

  if (!plannerId) {
    return res.status(400).json({ error: 'plannerId is required' });
  }

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task name cannot be empty' });
  }

  try {
    const planner = await Planner.findOne({
      where: { id: plannerId, userId: req.user.id },
    });
    if (!planner) {
      return res.status(403).json({ error: 'Planner not found or access denied' });
    }

    const taskCount = await Task.count({ where: { plannerId } });

    const task = await Task.create({
      text,
      type,
      notes,
      completed,
      plannerId,
      order: taskCount,
      logId: logId || null,
      ...(date && { date }),
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// PUT update a task (task's planner must belong to current user)
router.put('/:id', async (req, res) => {
  const { text } = req.body;

  if (text !== undefined && (!text || text.trim() === '')) {
    return res.status(400).json({ error: 'Task name cannot be empty' });
  }

  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: Planner, as: 'planner', attributes: ['userId'] }],
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (!task.planner || task.planner.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await task.update(req.body);
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// PUT reorder tasks (all tasks must belong to current user's planners)
router.put('/reorder', async (req, res) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: 'Invalid tasks format' });
  }

  try {
    for (const t of tasks) {
      const task = await Task.findByPk(t.id, {
        include: [{ model: Planner, as: 'planner', attributes: ['userId'] }],
      });
      if (!task || !task.planner || task.planner.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied to one or more tasks' });
      }
    }

    await Promise.all(
      tasks.map((t) => Task.update({ order: t.order }, { where: { id: t.id } }))
    );

    return res.status(200).json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return res.status(500).json({ error: error.message });
  }
});

// DELETE a task (task's planner must belong to current user)
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: Planner, as: 'planner', attributes: ['userId'] }],
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (!task.planner || task.planner.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await task.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
