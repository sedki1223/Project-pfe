// ./configs/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // Optional, fail fast
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1); // Stop app if DB connection fails
  }
};

export default connectDB;
