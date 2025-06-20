import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },                // Restaurant name
  description: { type: String, required: true },         // Description text
  contact: { type: String, required: true },             // Phone or email contact
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Owner user ID
  averagePrice: { type: Number, default: null },          // Average meal price (optional)
  rating: { type: Number, default: null },                // Average rating (optional)
  cuisines: { type: [String], default: [] },              // List of cuisine types served
  facilities: { type: [String], default: [] },            // Facilities/services offered
}, { timestamps: true });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
