const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'custom' },
    completedDates: [{ type: String }],
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    
    // NEW: Advanced Gamification & Freeze Logic
    streakFreezesAvailable: { type: Number, default: 2 }, // Monthly 2 freezes max
    usedFreezeDates: [{ type: String }], // Dates where streak was saved
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);