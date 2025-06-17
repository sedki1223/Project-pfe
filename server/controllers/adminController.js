// controllers/adminController.js
import Event from '../models/Events.js'
import Transport from '../models/transport.js'
import Reservation from '../models/Reservation.js'
import { clerkClient } from '@clerk/clerk-sdk-node'

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const eventCount = await Event.countDocuments()
    const transportCount = await Transport.countDocuments()
    res.json({ eventCount, transportCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const users = await clerkClient.users.getUserList()
    const formatted = users.map(u => ({
      id: u.id,
      fullName: u.firstName + ' ' + u.lastName,
      email: u.emailAddresses?.[0]?.emailAddress || '',
      role: u.publicMetadata?.role || 'user'
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// DELETE /api/admin/delete-event/:id
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Event.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Event not found' })
    res.json({ message: 'Event deleted', event: deleted })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// DELETE /api/admin/delete-transport/:id
export const deleteTransport = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Transport.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Transport not found' })
    res.json({ message: 'Transport deleted', transport: deleted })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// PATCH /api/admin/update-user-role/:userId
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body
    if (!role) return res.status(400).json({ error: 'Role is required' })

    const updated = await clerkClient.users.updateUser(userId, {
      publicMetadata: { role }
    })

    res.json({
      message: 'Role updated',
      userId: updated.id,
      newRole: updated.publicMetadata.role
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('transportId')
    res.json(reservations)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}