// routes/adminRoutes.js
import express from 'express'
import {
  getStats,
  getUsers,
  deleteEvent,
  deleteTransport,
  updateUserRole,
  getAllReservations
} from '../controllers/adminController.js'
import { protect, requireRole } from '../controllers/authMiddleware.js'

const router = express.Router()

router.use(protect, requireRole(['admin']))

router.get('/stats', getStats)
router.get('/users', getUsers)
router.delete('/delete-event/:id', deleteEvent)
router.delete('/delete-transport/:id', deleteTransport)
router.patch('/update-user-role/:userId', updateUserRole)
router.get('/reservations', getAllReservations)


export default router
