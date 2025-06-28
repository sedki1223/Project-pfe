import express from 'express';
import {
  createFoodOrder,
  getUserFoodOrders,
  getVendorFoodOrders,
  getVendorFoods,
  updateFoodAvailability,
} from '../controllers/orderController.js';
import protect, { requireRole } from '../controllers/authMiddleware.js';

const foodRouter = express.Router();

// 🛒 Place a food order
foodRouter.post('/order', protect, requireRole(["user"]), createFoodOrder);

// 👤 Get logged-in user's food orders
foodRouter.get('/my-orders', protect, requireRole(["user"]), getUserFoodOrders);

// 🧑‍🍳 Get all food orders for the vendor (owner)
foodRouter.get('/vendor-orders', protect, requireRole(["restaurantOwner"]), getVendorFoodOrders);

// 🍽️ Get all foods for the vendor (owner)
foodRouter.get('/vendor-foods', protect, requireRole(["restaurantOwner"]), getVendorFoods);

// ✏️ Update availability (or other editable fields) for a food item
foodRouter.patch('/:id', protect, requireRole(["restaurantOwner"]), updateFoodAvailability);

export default foodRouter;
