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
import foodOrderRouter from "./routes/foodOrderRoutes.js";
import restaurantRouter from './routes/restaurantRoutes.js';
import tripRouter from './routes/tripRoutes.js'; 


import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use(clerkMiddleware());

    app.post("/api/clerk", clerkWebhooks);

    // Your normal routes
    app.use("/api/user", userRouter);
    app.use("/api/hotel", hotelRouter);
    app.use("/api/rooms", roomRouter);
    app.use("/api/bookings", bookingRouter);
    app.use("/api/food-orders", foodOrderRouter);
    app.use("/api/restaurant", restaurantRouter);
    // OpenAI trip generation route
    app.use('/api/generate-trip', tripRouter);

    app.get("/", (req, res) => res.send("API is working"));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
