// routes/reservationRoutes.js
import express from 'express'
import {
  bookTransport,
  cancelReservation,
  getMyReservations
} from '../controllers/reservationController.js'
import {  requireRole } from '../controllers/authMiddleware.js'
import protect from '../controllers/authMiddleware.js'
const router = express.Router()

router.use(requireRole(['user']))

router.post('/', protect, bookTransport)
router.get('/', protect, getMyReservations)
router.delete('/:id', protect, cancelReservation)

export default router
