// controllers/authMiddleware.js

import User from "../models/User.js";

/**
 * FAKE AUTH MIDDLEWARE for debugging:
 * Skips Clerk validation, injects a hardcoded userId for local testing.
 */
const fakeAuth = async (req, res, next) => {
  console.log("[PROTECT] ⚠️ Using FAKE AUTH for local debugging.");

  try {
    // Fake the Clerk payload
    req.auth = async () => ({
      userId: "your_test_user_clerkId", // 👈 replace with a valid clerkId in your DB
    });

    next();
  } catch (err) {
    console.error("[FAKE AUTH] Error:", err);
    res.status(500).json({ message: "Fake auth failed", error: err.message });
  }
};

/**
 * PROTECT MIDDLEWARE:
 * 1️⃣ Uses fakeAuth to inject a clerkId.
 * 2️⃣ Calls req.auth() to get Clerk userId.
 * 3️⃣ Fetches your MongoDB user by clerkId.
 * 4️⃣ Attaches `req.user` for downstream routes.
 */
const protect = [
  (req, res, next) => {
    console.log("[PROTECT] Middleware triggered");
    next();
  },

  fakeAuth,

  async (req, res, next) => {
    console.log("[PROTECT] Fetching user using fakeAuth injected userId...");

    try {
      const authStart = Date.now();
      const auth = await req.auth();
      console.log(`[PROTECT] req.auth() returned in ${Date.now() - authStart}ms:`, auth);

      if (!auth || !auth.userId) {
        console.warn("[PROTECT] No userId in auth payload");
        return res.status(401).json({ message: "Unauthorized: No userId" });
      }

      const userFetchStart = Date.now();
      const user = await User.findOne({ clerkId: auth.userId });
      console.log(`[PROTECT] User from DB fetched in ${Date.now() - userFetchStart}ms:`, user);

      if (!user) {
        console.warn("[PROTECT] User not found in DB");
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      req.user = user;
      console.log("[PROTECT] ✅ req.user attached:", req.user);

      next();
    } catch (err) {
      console.error("[PROTECT] ❌ Error:", err);
      res.status(500).json({ message: "Server error in protect middleware", error: err.message });
    }
  },
];

export default protect;


/**
 * ROLE-BASED ACCESS CONTROL:
 * Checks if req.user exists and if its role is in the allowed roles array.
 */
export const requireRole = (roles) => (req, res, next) => {
  console.log(`\n========== [REQUIREROLE MIDDLEWARE] ${new Date().toISOString()} ==========`);
  console.log(`[REQUIREROLE] Checking roles ${roles} for route ${req.method} ${req.originalUrl}`);
  console.log(`[REQUIREROLE] req.user:`, req.user);

  if (!req.user) {
    console.warn(`[REQUIREROLE] ❌ No req.user found, blocking access`);
    return res.status(403).json({ message: "Forbidden: No user attached to request" });
  }

  if (!roles.includes(req.user.role)) {
    console.warn(`[REQUIREROLE] ❌ User role "${req.user.role}" is not permitted (allowed: ${roles})`);
    return res.status(403).json({ message: "Forbidden: Insufficient role" });
  }

  console.log(`[REQUIREROLE] ✅ Role "${req.user.role}" is permitted`);
  console.log(`========== [REQUIREROLE END] ${new Date().toISOString()} ==========\n`);
  next();
};
