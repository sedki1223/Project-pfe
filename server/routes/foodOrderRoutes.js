import express from 'express';
import {
  createFoodOrder,
  getUserFoodOrders,
  getVendorFoodOrders,
  getVendorFoods,
  updateFoodAvailability,
} from '../controllers/orderController.js';

import { protect } from '../controllers/authMiddleware.js';

const foodRouter = express.Router();

// 🛒 Place a food order
foodRouter.post('/order', protect, createFoodOrder);

// 👤 Get logged-in user's food orders
foodRouter.get('/my-orders', protect, getUserFoodOrders);

// 🧑‍🍳 Get all food orders for the vendor (owner)
foodRouter.get('/vendor-orders', protect, getVendorFoodOrders);

// 🍽️ Get all foods for the vendor (owner)
foodRouter.get('/vendor-foods', protect, getVendorFoods);

// ✏️ Update availability (or other editable fields) for a food item
foodRouter.patch('/:id', protect, updateFoodAvailability);

export default foodRouter;
