import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true }, // added hotel reference
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: { type: [String], required: true },
  images: { type: [String], required: true },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);

export default Room;
