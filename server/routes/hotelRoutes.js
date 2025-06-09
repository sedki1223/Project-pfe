import express from "express";
import { createHotel } from "../controllers/hotelController.js";
import { protect } from "../controllers/authMiddleware.js";

const router = express.Router();

// POST /api/hotels - Create a new hotel (protected route)
router.post("/", protect, createHotel);

export default router;
