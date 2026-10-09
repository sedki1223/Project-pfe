import express from "express";
import {
  createDish,
  getDishes,
  getOwnerDishes,
  toggleDishAvailability,
  getDishById,
} from "../controllers/dishController.js";
import protect, { requireRole } from "../controllers/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const dishRouter = express.Router();

// ✅ Public: Get all available dishes
// GET /api/dishes/
dishRouter.get("/", getDishes);

// ✅ Authenticated Owner: Get all dishes created by the owner
// GET /api/dishes/owner
dishRouter.get("/owner", protect, requireRole(["restaurantOwner"]), getOwnerDishes);

// ✅ Authenticated Owner: Create a new dish (with image upload)
// POST /api/dishes/create
dishRouter.post(
  "/create",
  protect,
  requireRole(["restaurantOwner"]),
  upload.array("images"), // ⚠️ Ensure single image upload unless you support multiple
  createDish
);

// ✅ Authenticated Owner: Toggle dish availability
// PUT /api/dishes/:id/availability
dishRouter.put(
  "/:id/availability",
  protect,
  requireRole(["restaurantOwner"]),
  toggleDishAvailability
);

// ✅ Public: Get dish by ID
// GET /api/dishes/:id
dishRouter.get("/:id", getDishById);

export default dishRouter;
