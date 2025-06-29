import express from 'express';
import {
  checkAvailabilityAPI ,
  createBooking,
  getHotelBookings,
  getUserBookings, 
} from '../controllers/bookingController.js';
import protect from '../controllers/authMiddleware.js';
//import { protect } from '../controllers/authMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI );
bookingRouter.post('/book', createBooking);
bookingRouter.get('/user',protect, getUserBookings);
bookingRouter.get('/hotel', getHotelBookings);

export default bookingRouter;
