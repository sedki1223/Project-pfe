// routes/eventRoutes.js
import express from 'express'
import { createEvent, getEvents } from '../controllers/eventsController.js'
import protect, {  requireRole } from '../controllers/authMiddleware.js'
import upload from "../middleware/uploadMiddleware.js";
import {
  rsvpToEvent,
  getEventAttendees,
  cancelRsvpToEvent,
  getEventById,
  likeEvent,
  unlikeEvent,
  addEventReview
} from '../controllers/eventsController.js'


const router = express.Router()

router.post('/create-event', protect, requireRole(['admin']), upload.array("images", 5), createEvent);
router.get('/', getEvents)
router.post('/:id/rsvp', protect, rsvpToEvent)
router.get('/:id/attendees', protect, getEventAttendees)
router.get('/:id', protect, getEventById)
router.delete('/:id/rsvp', protect, cancelRsvpToEvent)
router.post('/:id/like', protect, likeEvent);
router.delete('/:id/like', protect, unlikeEvent);
router.post('/:id/review', protect, addEventReview);

export default router
