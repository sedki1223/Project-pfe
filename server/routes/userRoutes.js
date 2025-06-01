import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentlyUsedHotels } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-used', protect, storeRecentlyUsedHotels);

export default userRouter;