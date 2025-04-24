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
      include: { model: Task, as: 'tasks' }
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

// POST new task (auto-create planner if needed)
router.post('/', async (req, res) => {
  const { date, ...taskData } = req.body;

  try {
    let planner = await Planner.findOne({ where: { date } });

    if (!planner) {
      planner = await Planner.create({ date });
    }

    const task = await Task.create({ ...taskData, plannerId: planner.id });
    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// PUT update a task
router.put('/:id', async (req, res) => {
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
