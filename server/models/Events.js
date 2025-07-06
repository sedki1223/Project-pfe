// models/Events.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // prevents auto-creating _id for subdocuments
);

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  date: { type: Date, required: true },
  time: String,
  price: Number,
 imageUrl: [{ type: String }],
  attendees: [
    {
      userId: { type: String, required: true },
      name: String,
      email: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: String }], // userId references

  // ✅ Add reviews support
  reviews: [reviewSchema],
});

export default mongoose.model('Event', eventSchema);
