// routes/eventRoutes.js
import express from 'express'
import { createEvent, getEvents } from '../controllers/eventsController.js'
import protect, {  requireRole } from '../controllers/authMiddleware.js'
import {
  rsvpToEvent,
  getEventAttendees,
  cancelRsvpToEvent,
  getEventById 
} from '../controllers/eventsController.js'


const router = express.Router()

router.post('/', protect, requireRole(['admin']), createEvent)
router.get('/',  getEvents)
router.post('/:id/rsvp', protect, requireRole(['user']), rsvpToEvent)
router.get('/:id/attendees', protect, requireRole(['admin']), getEventAttendees)
router.get('/:id', protect, getEventById)
router.delete('/:id/rsvp', protect, requireRole(['user']), cancelRsvpToEvent)

export default router
