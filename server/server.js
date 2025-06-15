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

import admin from './firebaseAdmin.js';
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
    app.post('/generate-trip', async (req, res) => {
      const { prompt, formData, user } = req.body;

      if (!prompt || !formData || !user?.uid || !user?.email) {
        return res.status(400).json({ error: 'Missing required data (prompt, formData, user)' });
      }

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        });

        const tripText = completion.choices[0]?.message?.content;

        const docRef = admin.firestore().collection('AiTrips').doc();
        await docRef.set({
          id: docRef.id,
          userId: user.uid,
          userEmail: user.email,
          userSelection: formData,
          tripData: tripText,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json({ tripId: docRef.id, tripText });
      } catch (err) {
        console.error('OpenAI or Firestore error:', err);
        res.status(500).json({ error: 'Failed to generate trip. Please try again later.' });
      }
    });

    app.get("/", (req, res) => res.send("API is working"));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
