const express = require('express');
const router = express.Router();

// Get all workouts
router.get('/', (req, res) => {
  res.json({ message: 'Fetch all workouts endpoint' });
});

// Add new workout
router.post('/', (req, res) => {
  res.json({ message: 'Create workout endpoint' });
});

// Delete workout
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete workout endpoint' });
});

module.exports = router;