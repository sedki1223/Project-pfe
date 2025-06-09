import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },               // Restaurant name
  description: { type: String, required: true },        // Description or address
  contact: { type: String, required: true },            // Contact number or email
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Owner user ID
  averagePrice: { type: Number },                        // Optional average meal price
  rating: { type: Number },                              // Average rating
  cuisines: { type: [String] },                          // Types of cuisine served
  facilities: { type: [String] },                        // Facilities or services offered
}, { timestamps: true });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
