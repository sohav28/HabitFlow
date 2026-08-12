const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String, // e.g., "Chest & Triceps", "Leg Day"
      required: true,
    },
    exercises: [
      {
        name: { type: String, required: true }, // e.g., "Bench Press"
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        weightKg: { type: Number, default: 0 },
      },
    ],
    completedDates: [{ type: String }], // 'YYYY-MM-DD'
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);