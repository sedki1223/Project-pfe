import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
    console.log("Database Connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
