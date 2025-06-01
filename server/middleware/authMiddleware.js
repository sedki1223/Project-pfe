// middleware/authMiddleware.js
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

export const clerkMiddleware = ClerkExpressWithAuth();

export const protect = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  req.userId = req.auth.userId;
  next();
};
