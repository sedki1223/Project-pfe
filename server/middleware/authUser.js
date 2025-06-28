import User from "../models/User.js";

export async function addUserToReq(req, res, next) {
  try {
    const clerkUserId = req.auth.userId; // set by clerkMiddleware

    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // attach user document
    next();
  } catch (err) {
    next(err);
  }
}
