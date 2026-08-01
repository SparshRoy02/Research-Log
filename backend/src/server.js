require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Unable to set custom DNS servers, using system default.');
}
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const researchRoutes = require('./routes/researchRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/research', researchRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Research Agent API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
