import express from "express";
import {
  createDish,
  getDishes,
  getOwnerDishes,
  updateDishAvailability,
  getDishById
} from "../controllers/dishController.js";

import upload from '../middleware/uploadMiddleware.js';
import {  requireRole } from '../controllers/authMiddleware.js';

const router = express.Router();



// ✅ Public Route: Get all dishes (optional if you want to expose everything)
router.get("/", getDishes);

// ✅ Authenticated Route: Get all dishes created by the logged-in user
router.get("/my-dishes", getOwnerDishes);

// ✅ Authenticated Route: Create a new dish (with image upload)
router.post("/create", requireRole(["restaurantOwner"]), createDish);


// ✅ Authenticated Route: Update dish availability (toggle on/off)
router.put("/:id/availability", updateDishAvailability);

router.get("/:id", getDishById);



export default router;
