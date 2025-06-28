import { requireAuth as clerkRequireAuth } from "@clerk/express";
import User from "../models/User.js";

const protect = [
  clerkRequireAuth({
    unauthorized: (res) => res.status(401).json({ message: "Unauthorized" }),
  }),
  async (req, res, next) => {
    try {
      const auth = req.auth();
      const userId = auth.userId || auth.sub;
      if (!userId) return res.status(401).json({ message: "Not authenticated" });

      const user = await User.findOne({ clerkId: userId });
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Authentication error" });
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
