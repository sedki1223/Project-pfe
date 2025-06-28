import express from 'express';
import { createHotel } from '../controllers/hotelController.js';
import protect from '../controllers/authMiddleware.js';
import { requireRole }   from '../controllers/authMiddleware.js';

const hotelRouter = express.Router();

// Change GET to POST and add /register path
hotelRouter.post('/register', protect, requireRole(["hotelOwner"]), createHotel);


export default hotelRouter;
