// controllers/eventController.js
import Event from '../models/Events.js'


export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// RSVP to an event
export const rsvpToEvent = async (req, res) => {
  const { id } = req.params
  const { id: userId, fullName, emailAddresses } = req.user
  const email = emailAddresses?.[0]?.emailAddress || ''

  try {
    const event = await Event.findById(id)
    if (!event) return res.status(404).json({ error: 'Event not found' })

    const alreadyJoined = event.attendees.some(a => a.userId === userId)
    if (alreadyJoined) return res.status(400).json({ error: 'Already RSVPed' })

    event.attendees.push({ userId, name: fullName, email })
    await event.save()

    res.json({ message: 'RSVP successful', attendees: event.attendees })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get attendees for an event
export const getEventAttendees = async (req, res) => {
  try {
    const { id } = req.params
    const event = await Event.findById(id).select('attendees')
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.json(event.attendees)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// Cancel RSVP
export const cancelRsvpToEvent = async (req, res) => {
  const { id } = req.params
  const { id: userId } = req.user

  try {
    const event = await Event.findById(id)
    if (!event) return res.status(404).json({ error: 'Event not found' })

    const originalCount = event.attendees.length
    event.attendees = event.attendees.filter(a => a.userId !== userId)

    if (event.attendees.length === originalCount)
      return res.status(400).json({ error: 'You were not RSVPed' })

    await event.save()
    res.json({ message: 'RSVP canceled', attendees: event.attendees })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};