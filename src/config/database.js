/**
 * Database Configuration
 * Handles MongoDB connection setup
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/english-center';
    
    // Mongoose 6+ không cần useNewUrlParser và useUnifiedTopology
    await mongoose.connect(mongoURI);

    console.log('✓ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    console.log('⚠ Server will continue without database connection');
    // Không exit để server vẫn chạy được
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
