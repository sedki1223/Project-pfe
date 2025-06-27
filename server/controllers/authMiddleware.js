import { requireAuth as clerkRequireAuth } from "@clerk/express";
import User from "../models/User.js";

const protect = [
  clerkRequireAuth(),
  async (req, res, next) => {
    try {
      const userId = req.auth.userId || req.auth.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // attaches user (_id, role, etc.)
      next();
    } catch (error) {
      console.error("Protect middleware error:", error);
      res.status(500).json({ message: "Server error in authentication" });
    }
  },
];

export default protect;


// Role-based access control middleware
export const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: Insufficient role" });
  }
  next();
};
