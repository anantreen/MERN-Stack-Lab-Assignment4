const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose
    .connect('mongodb://localhost:27017/notes_db')
    .then(() => {
      console.log('MongoDB connected: notes_db');
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
    });
};

module.exports = connectDB;
