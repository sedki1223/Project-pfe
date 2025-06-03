import express from 'express';
import { protect } from '../controllers/authMiddleware.js';
import { createHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();

// Change GET to POST and add /register path
// hotelRoutes.js
// Comment out protect temporarily
hotelRouter.post('/register', /* protect, */ createHotel);
hotelRouter.get('/test', (req, res) => res.json({ message: 'Hotel router works' }));



export default hotelRouter;
