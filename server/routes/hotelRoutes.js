import express from 'express';
import { protect } from '../controllers/authMiddleware.js';
import { createHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();

// Change GET to POST and add /register path
hotelRouter.post('/register', protect, createHotel);

export default hotelRouter;
