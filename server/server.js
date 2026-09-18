const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = 8000;

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ message: 'Student Notes API is running.' });
});

// Routes
app.use('/api/notes', noteRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
