import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },            // Name of the dish
  description: { type: String, required: true },     // Description replaces address
  contact: { type: String, required: true },         // Maybe the chef or restaurant contact
  owner: { type: String, ref: "User", required: true },  // Owner (restaurant/chef)
  price: { type: Number },                           // Price of the dish
  rating: { type: Number },                          // Average rating
  ingredients: { type: [String] },                   // Replaces amenities
}, { timestamps: true });

const Food = mongoose.model("Food", foodSchema);

export default Food;
