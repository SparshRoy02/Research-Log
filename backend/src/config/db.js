const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/research_agent';
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not crash the application completely if DB is down, just print warning, allowing offline test mode
    console.warn('Proceeding without database persistence if local db is not running...');
  }
};

module.exports = connectDB;
