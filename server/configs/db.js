// ./configs/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected to DB:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};


export default connectDB;
