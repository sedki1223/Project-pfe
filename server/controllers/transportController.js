// controllers/transportController.js
import Transport from '../models/transport.js'

// Create a new transport option
export const createTransport = async (req, res) => {
  try {
    const { type, destination, date, time, price, availableSeats } = req.body

    if (!type || !destination || !date || !time || !price || !availableSeats) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const newTransport = await Transport.create({
      type,
      destination,
      date,
      time,
      price,
      availableSeats,
    })

    res.status(201).json(newTransport)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Fetch transports with optional filters
export const getTransports = async (req, res) => {
  try {
    const { destination, date, type, time } = req.query
    const filters = {}

    if (destination) filters.destination = destination
    if (type && type !== 'All') filters.type = type.toLowerCase()

    if (date) {
      // Filter by date only (ignore time portion)
      const selectedDate = new Date(date)
      const nextDate = new Date(selectedDate)
      nextDate.setDate(nextDate.getDate() + 1)

      filters.date = {
        $gte: selectedDate,
        $lt: nextDate
      }
    }

    if (time) filters.time = time

    const transports = await Transport.find(filters).sort({ date: 1, time: 1 })
    res.json(transports)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// controllers/transportController.js
export const getTransportById = async (req, res) => {
  try {
    const { id } = req.params
    const transport = await Transport.findById(id)
    if (!transport) {
      return res.status(404).json({ error: 'Transport option not found' })
    }
    res.json(transport)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
