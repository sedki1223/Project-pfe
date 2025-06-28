import express from 'express';
import protect from '../controllers/authMiddleware.js';
import { getUserData, storeRecentlyUsedHotels, storeRecentlyUsedFoods } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post('/recently-used-hotels', protect, storeRecentlyUsedHotels);
userRouter.post('/recently-used-foods', protect, storeRecentlyUsedFoods);

export default userRouter;
    