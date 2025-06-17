// routes/eventRoutes.js
import express from 'express'
import { createEvent, getEvents } from '../controllers/eventsController.js'
import { requireAuth, requireRole } from '../controllers/authMiddleware.js'
import {
  rsvpToEvent,
  getEventAttendees,
  cancelRsvpToEvent,
  getEventById 
} from '../controllers/eventsController.js'


const router = express.Router()

router.post('/', requireAuth, createEvent)
router.get('/', getEvents)
router.post('/:id/rsvp', requireAuth, rsvpToEvent)
router.get('/:id/attendees', requireAuth, requireRole(['admin']), getEventAttendees)
router.get('/:id', getEventById)
router.delete('/:id/rsvp', requireAuth, cancelRsvpToEvent)

export default router
