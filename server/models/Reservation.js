// models/Reservation.js
import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  transportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport' },
  fullName: String,
  email: String,
  seats: { type: Number, required: true },
  date: { type: Date, default: Date.now }
})

export default mongoose.model('Reservation', reservationSchema)
