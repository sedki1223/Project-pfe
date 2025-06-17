// models/Event.js
import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  date: { type: Date, required: true },
  time: String,
  price: Number,
  imageUrl: String,
  attendees: [
    {
      userId: { type: String, required: true },
      name: String,
      email: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
})

export default mongoose.model('Event', eventSchema)
