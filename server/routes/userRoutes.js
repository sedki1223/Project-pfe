import express from "express";
import  protect  from "../controllers/authMiddleware.js";
import { getUserData, storeRecentlyUsedHotels } from "../controllers/UserController.js";

const fakeAuthMiddleware = (req, res, next) => {
  req.user = {
    id: "testuser123",
    role: "user",
    recentlyUsedHotels: [],
    recentlyUsedFoods: []
  };
  next();
};
const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-used", protect, storeRecentlyUsedHotels);

export default userRouter;
