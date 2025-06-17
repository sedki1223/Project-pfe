// models/Transport.js
import mongoose from 'mongoose'

const transportSchema = new mongoose.Schema({
  type: { type: String, enum: ['bus', 'train', 'taxi'], required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
})

export default mongoose.model('Transport', transportSchema)
