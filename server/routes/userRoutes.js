import express from "express";
import { protect } from "../controllers/authMiddleware.js";
import { getUserData, storeRecentlyUsedHotels ,storeRecentlyUsedFoods } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-used", protect, storeRecentlyUsedHotels);
userRouter.post("/store-recent-foods", protect, storeRecentlyUsedFoods);

export default userRouter;
