// routes/transportRoutes.js
import express from 'express'
import {
  createTransport,
  getTransports,
  getTransportById,
  bookSeats,
  addReview,
} from '../controllers/transportController.js'
import protect from '../controllers/authMiddleware.js'
import { requireRole } from '../controllers/authMiddleware.js'

const router = express.Router()

router.get('/', getTransports)
router.get('/:id', protect, getTransportById) // get transport with reviews

router.post('/', protect, requireRole(['admin']), createTransport)

// New routes for booking seats and adding reviews (both require authentication)
router.patch('/:id/book', protect, bookSeats)
router.post('/:id/reviews', protect, addReview)

export default router
