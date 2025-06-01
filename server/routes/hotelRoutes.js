import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();

hotelRouter.get('/', protect, createHotel);

export default hotelRouter;

