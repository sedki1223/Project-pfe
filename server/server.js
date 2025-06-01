import dotenv from "dotenv";
dotenv.config(); // ✅ Explicitly load environment variables at the top

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const startServer = async () => {
  try {
    console.log("📦 MONGODB_URI =", process.env.MONGODB_URI); // 👈 TEMP debug log

    await connectDB(); // ✅ Connect to MongoDB
    connectCloudinary(); // ✅ Connect Cloudinary

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(clerkMiddleware());

    app.post("/api/clerk", clerkWebhooks);
    app.get("/", (req, res) => res.send("API is Working"));
    app.use("/api/user", userRouter);
    app.use("/api/hotel", hotelRouter);
    app.use("/api/rooms", roomRouter);
    app.use("/api/bookings", bookingRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
