import express from 'express';
//import { protect } from '../controllers/authMiddleware.js';
import { createrestaurant } from '../controllers/restaurantController.js';
import protect from '../controllers/authMiddleware.js';

const restaurantRouter = express.Router();

// POST request to /register for adding restaurant
restaurantRouter.post('/register',protect,  createrestaurant);

export default restaurantRouter;
