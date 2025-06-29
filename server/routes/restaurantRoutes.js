import express from 'express';
import { createRestaurant } from '../controllers/restaurantController.js';
import protect from '../controllers/authMiddleware.js';

const restaurantRouter = express.Router();

// POST request to /register for adding restaurant
restaurantRouter.post('/register',protect,  createRestaurant);

export default restaurantRouter;
