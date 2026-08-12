const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Push Ups"
  category: { type: String, required: true }, // Chest, Legs, Core, Cardio
  imageUrl: { type: String, required: true }, // Unsplash / GIF image link
  description: { type: String },
  targetSets: { type: Number, default: 3 },
  targetReps: { type: Number, default: 12 },
  defaultRestTimerSec: { type: Number, default: 60 }, // Rest time between sets
});

module.exports = mongoose.model('Exercise', exerciseSchema);