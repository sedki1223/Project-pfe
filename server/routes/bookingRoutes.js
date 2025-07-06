import express from 'express';
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings, 
  cancelBooking,
} from '../controllers/bookingController.js';
import protect from '../controllers/authMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', protect, checkAvailabilityAPI );
bookingRouter.post('/book', protect,createBooking);
bookingRouter.get('/user',protect, getUserBookings);
bookingRouter.get('/hotel',protect, getHotelBookings);
bookingRouter.patch("/:id/cancel", protect, cancelBooking);

export default bookingRouter;
