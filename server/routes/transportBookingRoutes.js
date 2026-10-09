import express from "express";
import {
  createTransportBooking,
  getUserTransportBookings,
  cancelTransportBooking,
} from "../controllers/transportBookingController.js";
import protect from "../controllers/authMiddleware.js";

const router = express.Router();

router.post("/book", protect, createTransportBooking);
router.get("/user", protect, getUserTransportBookings);
router.patch("/:id/cancel", protect, cancelTransportBooking);

export default router;