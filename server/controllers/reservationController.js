// controllers/reservationController.js
import Reservation from '../models/Reservation.js'
import Transport from '../models/transport.js'

// Book a transport
export const bookTransport = async (req, res) => {
  const { transportId, seats } = req.body
  const { id: userId, fullName, emailAddresses } = req.user
  const email = emailAddresses?.[0]?.emailAddress || ''

  try {
    const transport = await Transport.findById(transportId)
    if (!transport) return res.status(404).json({ error: 'Transport not found' })

    if (seats > transport.seatsAvailable)
      return res.status(400).json({ error: 'Not enough seats available' })

    // Create reservation
    const reservation = new Reservation({
      userId,
      transportId,
      fullName,
      email,
      seats
    })
    await reservation.save()

    // Decrease available seats
    transport.seatsAvailable -= seats
    await transport.save()

    res.json({ message: 'Reservation successful', reservation })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Cancel reservation
export const cancelReservation = async (req, res) => {
  const { id } = req.params
  const { id: userId } = req.user

  try {
    const reservation = await Reservation.findById(id)
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })
    if (reservation.userId !== userId)
      return res.status(403).json({ error: 'Not allowed' })

    const transport = await Transport.findById(reservation.transportId)
    if (transport) {
      transport.seatsAvailable += reservation.seats
      await transport.save()
    }

    await reservation.deleteOne()
    res.json({ message: 'Reservation canceled' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get my reservations
export const getMyReservations = async (req, res) => {
  const { id: userId } = req.user
  try {
    const reservations = await Reservation.find({ userId }).populate('transportId')
    res.json(reservations)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
