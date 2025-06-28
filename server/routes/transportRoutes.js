// routes/transportRoutes.js
import express from 'express'
import {
  createTransport,
  getTransports,
  getTransportById 
} from '../controllers/transportController.js'
import protect from '../controllers/authMiddleware.js'
import { requireRole } from '../controllers/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getTransports)
router.get('/:id', protect, getTransportById) 
router.post('/', protect, requireRole(["admin"]), createTransport)

export default router
