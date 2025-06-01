import express from 'express';
import { protect } from '../controllers/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-used', protect, storeRecentlyUsedHotels);

export default userRouter;