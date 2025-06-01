import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    console.log('req.headers:', req.headers);
    console.log('req.auth:', req.auth);

    const { clerkId } = req.auth;

    if (!clerkId) {
      console.log('No user ID in token');
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID in token." });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(500).json({ success: false, message: "Server error in auth middleware." });
  }
};