import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Restaurant' if you have a separate model
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // URL or path to image
  },
  category: {
    type: String, // e.g. "Appetizer", "Main Course", "Dessert"
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Food = mongoose.model('Food', foodSchema);

export default Food;
