import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  ingredients: { type: [String], default: [] },  
  image: { type: String,  },       
  category: { type: String},    
  isAvailable: { type: Boolean},
}, { timestamps: true });

export default mongoose.model("Dish", dishSchema);
