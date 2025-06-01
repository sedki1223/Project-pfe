import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { _id } = req.auth;

    if (!_id) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID in token." });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(500).json({ success: false, message: "Server error in auth middleware." });
  }
};

