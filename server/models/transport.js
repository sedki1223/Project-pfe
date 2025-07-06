import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const transportSchema = new mongoose.Schema({
  type: { type: String, enum: ['bus', 'train', 'taxi'], required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  bookings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, seats: Number }],
  reviews: [reviewSchema],
});

export default mongoose.model('Transport', transportSchema);
