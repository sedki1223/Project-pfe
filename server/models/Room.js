import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hotel: { type: String, ref: "Hotel", required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: { type: [String], required: true },
  images: [{ type: [String], required: true }],
  isAvailable: { type: Boolean, default: true },
},{timestamps: true});

const Room = mongoose.model("Room", roomSchema);

export default Room;
