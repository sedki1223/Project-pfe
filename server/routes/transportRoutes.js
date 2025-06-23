// routes/transportRoutes.js
import express from 'express'
import {
  createTransport,
  getTransports,
  getTransportById 
} from '../controllers/transportController.js'
import { protect } from '../controllers/authMiddleware.js'

const router = express.Router()

router.get('/', getTransports)
router.get('/:id', getTransportById) 
router.post('/', protect, createTransport)

export default router
