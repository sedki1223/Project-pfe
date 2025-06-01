import express from 'express';
import { protect } from '../controllers/authMiddleware.js';
import { getUserData, storeRecentlyUsedHotels } from '../controllers/UserController.js';

const userRouter = express.Router();    

// GET user info (e.g., role)
userRouter.get('/', protect, getUserData);

// POST store recently used hotels
userRouter.post('/store-recent-used', protect, storeRecentlyUsedHotels);

export default userRouter;
