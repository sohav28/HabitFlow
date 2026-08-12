const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const { protect } = require('../middleware/authMiddleware');

// Helper Function: Advanced Streak Calculation with Streak Freeze Support
const calculateStreaks = (completedDates = [], usedFreezeDates = []) => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Combine completion dates and freeze dates to check continuity
  const activeSet = new Set([...completedDates, ...usedFreezeDates]);
  const sortedDates = Array.from(activeSet)
    .map((d) => new Date(d))
    .sort((a, b) => b - a); // Descending order (latest first)

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const latestDate = new Date(sortedDates[0]);
  latestDate.setHours(0, 0, 0, 0);

  // Check if streak is active today or yesterday
  const isStreakActive =
    latestDate.getTime() === today.getTime() ||
    latestDate.getTime() === yesterday.getTime();

  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      prevDate.setHours(0, 0, 0, 0);

      const currDate = new Date(sortedDates[i]);
      currDate.setHours(0, 0, 0, 0);

      const diffInDays = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));

      if (diffInDays === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 1;
      }
    }
  }

  if (tempStreak > longestStreak) longestStreak = tempStreak;

  return {
    currentStreak: isStreakActive ? tempStreak : 0,
    longestStreak,
  };
};

// @route   GET /api/habits
// @desc    Get all habits for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Recalculate streaks dynamically for accurate response
    const updatedHabits = habits.map((habit) => {
      const { currentStreak, longestStreak } = calculateStreaks(
        habit.completedDates,
        habit.usedFreezeDates
      );
      return {
        ...habit._doc,
        currentStreak,
        longestStreak,
      };
    });

    res.json(updatedHabits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/habits
// @desc    Create a new habit
router.post('/', protect, async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const habit = await Habit.create({
      user: req.user._id,
      title,
      category: category || 'custom',
      completedDates: [],
      usedFreezeDates: [],
      streakFreezesAvailable: 2,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/habits/:id/toggle
// @desc    Toggle complete/uncomplete for today (or a specific YYYY-MM-DD date)
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const targetDate = req.body.date || new Date().toISOString().split('T')[0];
    const index = habit.completedDates.indexOf(targetDate);

    if (index > -1) {
      // Uncheck habit
      habit.completedDates.splice(index, 1);
    } else {
      // Check habit
      habit.completedDates.push(targetDate);
    }

    // Recalculate streaks before saving
    const { currentStreak, longestStreak } = calculateStreaks(
      habit.completedDates,
      habit.usedFreezeDates
    );
    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/habits/:id/freeze
// @desc    Use a Streak Freeze token for yesterday/missed date
router.put('/:id/freeze', protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.streakFreezesAvailable <= 0) {
      return res.status(400).json({ message: 'No streak freeze tokens left for this month!' });
    }

    const targetDate = req.body.date; // Date string 'YYYY-MM-DD'
    if (!targetDate) {
      return res.status(400).json({ message: 'Target date required for freeze' });
    }

    if (!habit.usedFreezeDates.includes(targetDate)) {
      habit.usedFreezeDates.push(targetDate);
      habit.streakFreezesAvailable -= 1;
    }

    const { currentStreak, longestStreak } = calculateStreaks(
      habit.completedDates,
      habit.usedFreezeDates
    );
    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
router.delete('/:id', protect, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;