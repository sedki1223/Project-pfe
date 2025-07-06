import mongoose from "mongoose";

const transportBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transport: { type: mongoose.Schema.Types.ObjectId, ref: "Transport", required: true },
  seats: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "confirmed" }, // confirmed, cancelled, etc.
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TransportBooking", transportBookingSchema);
