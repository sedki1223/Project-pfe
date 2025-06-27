import express from "express";
import { getUserData, storeRecentlyUsedHotels } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/",  getUserData);
userRouter.post("/store-recent-used",  storeRecentlyUsedHotels);

export default userRouter;
