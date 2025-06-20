// routes/transportRoutes.js
import express from 'express'
import {
  createTransport,
  getTransports,
  getTransportById 
} from '../controllers/transportController.js'
import { requireAuth } from '../controllers/authMiddleware.js'

const router = express.Router()

router.get('/', getTransports)
router.get('/:id', getTransportById) 
router.post('/', requireAuth, createTransport)

export default router
