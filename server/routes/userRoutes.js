import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentlyUsedHotels } from '../controllers/userController.js';

const userRouter = express.Router();

// @route   GET /api/user
// @desc    Get current user role
// @access  Protected
userRouter.get('/', protect, getUserData);

// @route   POST /api/user/store-recent
// @desc    Store recently used hotel
// @access  Protected
userRouter.post('/store-recent', protect, storeRecentlyUsedHotels);

export default userRouter;
