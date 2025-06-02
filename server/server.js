import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    const app = express();

    app.use(cors());
    app.use(express.json());

    // ✅ Clerk middleware (must be before protected routes)
    app.use(clerkMiddleware());

    app.post("/api/clerk", clerkWebhooks);
    app.get("/", (req, res) => res.send("API is working"));

    // ✅ Routers
    app.use("/api/user", userRouter);
    app.use('/api/hotel', hotelRouter);
    app.use("/api/rooms", roomRouter);
    app.use("/api/bookings", bookingRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
