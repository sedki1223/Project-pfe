import express from 'express';
import { protect } from '../controllers/authMiddleware.js';
import { createFood } from '../controllers/foodController.js';

const foodRouter = express.Router();

// POST request to /register for adding food
foodRouter.post('/register', protect, createFood);

export default foodRouter;
