import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true, // ensure webhook always sends this (fallback from email)
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "hotelOwner"],
    default: "user",
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
