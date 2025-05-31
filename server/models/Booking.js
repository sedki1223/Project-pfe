import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: String, ref: "User", required: true },
  hotel: { type: String, ref: "Hotel", required: true },
  room: { type: String, ref: "Room", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending","booked", "cancelled"], default: "pending" },
  guests: { type: Number, required: true },
  paymentMethod: { type: String, default: "Pay at Hotel", required: true },
  isPaid: { type: Boolean, default: false },
},{timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
