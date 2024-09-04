const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const mongoURL = 'mongodb+srv://admin:Sonu2121@test-employee.lwkr1yc.mongodb.net/test-employee'
    await mongoose.connect(mongoURL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
module.exports = connectDB;
