import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },                
  description: { type: String, required: false },         
  contact: { type: String, required: true },             
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  averagePrice: { type: Number, default: null },          
  rating: { type: Number, default: null },                
  cuisines: { type: [String], default: [] },              
  facilities: { type: [String], default: [] },    
  address: { type: String, required: true },        
}, { timestamps: true });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
