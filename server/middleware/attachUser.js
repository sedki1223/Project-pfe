import User from "../models/User.js";

export async function attachUser(req, res, next) {
  try {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    req.user = user; // attach DB user to req for controller access
    next();
  } catch (err) {
    console.error("attachUser error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
