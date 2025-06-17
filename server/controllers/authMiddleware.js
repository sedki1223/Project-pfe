import { requireAuth as clerkRequireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protect = [
  clerkRequireAuth(), // ✅ This validates Clerk JWT and adds req.auth.userId
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

export const requireAuth = [
  clerkRequireAuth(), // Clerk middleware
  async (req, res, next) => {
    try {
      const clerkId = req.auth.userId;
      if (!clerkId) return res.status(401).json({ message: "Unauthorized: No Clerk ID" });

      const user = await User.findOne({ clerkId });
      if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Auth middleware error" });
    }
  },
];

export const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: Insufficient role" });
  }
  next();
};
