const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const dns = require('dns');

// Force Node.js to use Google's Public DNS for SRV queries
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/habitflow');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.send('HabitFlow API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});