import express from 'express';
import {
  createFoodOrder,
  getUserFoodOrders,
  getVendorFoodOrders,
  getVendorFoods,
  updateFoodAvailability,
} from '../controllers/orderController.js';
//import { protect } from '../controllers/authMiddleware.js';

const foodRouter = express.Router();

// 🛒 Place a food order
foodRouter.post('/order',  createFoodOrder);
// 👤 Get logged-in user's food orders
foodRouter.get('/my-orders', getUserFoodOrders);

// 🧑‍🍳 Get all food orders for the vendor (owner)
foodRouter.get('/vendor-orders' , getVendorFoodOrders);

// 🍽️ Get all foods for the vendor (owner)
foodRouter.get('/vendor-foods' , getVendorFoods);

// ✏️ Update availability (or other editable fields) for a food item
foodRouter.patch('/:id', updateFoodAvailability);

export default foodRouter;
