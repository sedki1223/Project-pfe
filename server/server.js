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
import transportRoutes from './routes/transportRoutes.js'
import eventRoutes from './routes/eventsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import reservationRoutes from './routes/reservationRoutes.js'
import dishRoutes from "./routes/dishRoutes.js";
import transportBookingRoutes from "./routes/transportBookingRoutes.js";


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
    app.use("/api/dishes", dishRoutes);
    app.use("/api/bookings", bookingRouter);
    app.use("/api/food-orders", foodOrderRouter);
    app.use("/api/restaurant", restaurantRouter);
    app.use('/api/transport', transportRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/reservations', reservationRoutes);
    app.use("/api/transport-bookings", transportBookingRoutes);
    

    // Groq trip generation route
    app.use('/api/generate-trip', tripRouter);
    
app.use((err, req, res, next) => {
    console.error('🔥 Uncaught Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
});
    
app.get("/", (req, res) => res.send("API is working"));


    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
