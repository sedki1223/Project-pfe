import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protect = [
  requireAuth(), // ✅ This validates Clerk JWT and adds req.auth.userId
  async (req, res, next) => {
    try {
      const clerkId = req.auth.userId;

      if (!clerkId) {
        return res.status(401).json({ success: false, message: "Unauthorized: No Clerk ID" });
      }

      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Protect middleware error:", error);
      res.status(500).json({ success: false, message: "Server error in auth middleware." });
    }
  },
];
