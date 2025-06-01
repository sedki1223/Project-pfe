import dotenv from "dotenv";
dotenv.config(); // ✅ Explicitly load environment variables at the top

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware, ClerkExpressRequireAuth } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import User from "./models/User.js"; // Import User model for protect middleware

const app = express();

const protect = [
  ClerkExpressRequireAuth(), // Clerk middleware verifies token and populates req.auth
  async (req, res, next) => {
    try {
      const clerkId = req.auth.userId;

      if (!clerkId) {
        return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
      }

      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Protect middleware error:", error);
      return res.status(500).json({ success: false, message: "Server error in auth middleware." });
    }
  }
];

const startServer = async () => {
  try {
    console.log("📦 MONGODB_URI =", process.env.MONGODB_URI); // 👈 TEMP debug log

    await connectDB(); // ✅ Connect to MongoDB
    connectCloudinary(); // ✅ Connect Cloudinary

    app.use(cors());
    app.use(express.json());
    app.use(clerkMiddleware()); // Automatically verifies Clerk JWT and adds req.auth

    app.post("/api/clerk", clerkWebhooks);
    app.get("/", (req, res) => res.send("API is Working"));

    // Public routes (no auth required)
    app.use("/api/user", userRouter);

    // Protected routes example — add protect middleware to secure them
    app.use("/api/hotel", protect, hotelRouter);
    app.use("/api/rooms", protect, roomRouter);
    app.use("/api/bookings", protect, bookingRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
