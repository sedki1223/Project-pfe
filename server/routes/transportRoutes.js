// routes/transportRoutes.js
import express from 'express'
import {
  createTransport,
  getTransports
} from '../controllers/transportController.js'
import { requireAuth } from '../controllers/authMiddleware.js'

const router = express.Router()

// @desc    Get all transports with optional filters
// @route   GET /api/transport
// @access  Public
router.get('/', getTransports)

// @desc    Create a new transport (Bus/Train/Taxi)
// @route   POST /api/transport
// @access  Protected (requires login)
router.post('/', requireAuth, createTransport)

export default router
