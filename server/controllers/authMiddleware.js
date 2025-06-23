import { requireAuth as clerkRequireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protect = [
  clerkRequireAuth(),  // Validates the Clerk JWT and populates req.auth
  async (req, res, next) => {
    const { userId } = req.auth;
    if (!userId) return res.status(401).json({ success: false, message: "Not authenticated" });

    const user = await User.findOne({ clerkId: userId });  // or .findById(userId) based on your schema
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  }
];
export const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: Insufficient role" });
  }
  next()
};