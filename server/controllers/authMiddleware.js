import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ success: false, message: "Server error: Missing JWT secret" });
    }

    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token payload" });
    }

    // Find user by ID, exclude password from results
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    // Attach user to request object for further use
    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Unauthorized: Token expired" });
    }

    res.status(401).json({ success: false, message: "Unauthorized: Token verification failed" });
  }
};
