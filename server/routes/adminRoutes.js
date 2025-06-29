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

import protect,{  requireRole }  from '../controllers/authMiddleware.js'

const router = express.Router()

router.use( protect )
router.use( requireRole(['admin']))

router.get('/stats',protect ,getStats)
router.get('/users',protect , getUsers)
router.delete('/delete-event/:id',protect , deleteEvent)
router.delete('/delete-transport/:id',protect , deleteTransport)
router.patch('/update-user-role/:userId',protect , updateUserRole)
router.get('/reservations',protect , getAllReservations)


export default router
