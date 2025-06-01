import express from 'express';
import { createHotel } from '../controllers/hotelController.js';
import { protect } from '../controllers/authMiddleware.js';

const hotelRouter = express.Router();

hotelRouter.post('/', protect, createHotel); // Changed from get to post

export default hotelRouter;
