// routes/reservationRoutes.js
import express from 'express'
import {
  bookTransport,
  cancelReservation,
  getMyReservations
} from '../controllers/reservationController.js'
import {  requireRole } from '../controllers/authMiddleware.js'

const router = express.Router()

router.use(requireRole(['user']))

router.post('/', bookTransport)
router.get('/', getMyReservations)
router.delete('/:id', cancelReservation)

export default router
