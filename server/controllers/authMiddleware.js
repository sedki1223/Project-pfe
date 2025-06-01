import User from "../models/User.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const protect = [
  ClerkExpressRequireAuth(), // verifies the token, populates req.auth
  async (req, res, next) => {
    try {
      const clerkId = req.auth.userId;

      if (!clerkId) {
        return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
      }

      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Protect middleware error:", error);
      return res.status(500).json({ success: false, message: "Server error in auth middleware." });
    }
  }
];
