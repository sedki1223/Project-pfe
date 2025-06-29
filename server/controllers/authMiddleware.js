import { requireAuth as clerkRequireAuth } from "@clerk/express";
import User from "../models/User.js";

/**
 * PROTECT MIDDLEWARE:
 * 1️⃣ Uses Clerk's requireAuth to enforce JWT presence.
 * 2️⃣ Calls req.auth() to get Clerk userId.
 * 3️⃣ Fetches your MongoDB user by clerkId.
 * 4️⃣ Attaches `req.user` for downstream routes.
 */
const protect = [
  clerkRequireAuth(),

  async (req, res, next) => {
    const start = Date.now();
    console.log(`\n========== [PROTECT MIDDLEWARE START] ${new Date().toISOString()} ==========`);

    try {
      console.log(`[PROTECT] Incoming request for ${req.method} ${req.originalUrl}`);
      console.log(`[PROTECT] Authorization header: ${req.headers.authorization}`);

      // Call req.auth() to get Clerk authentication payload
      const authStart = Date.now();
      const auth = await req.auth();
      console.log(`[PROTECT] Clerk req.auth() resolved in ${Date.now() - authStart}ms`);
      console.log(`[PROTECT] Clerk auth payload:`, auth);

      // Extract userId from Clerk payload
      const userId = auth.userId || auth.sub;
      console.log(`[PROTECT] Clerk userId extracted: ${userId}`);

      if (!userId) {
        console.warn(`[PROTECT] ❌ No userId in Clerk token`);
        return res.status(401).json({ message: "Unauthorized: No Clerk userId found" });
      }

      // Fetch user from your MongoDB
      const userFetchStart = Date.now();
      const user = await User.findOne({ clerkId: userId });
      console.log(`[PROTECT] User fetch from MongoDB took ${Date.now() - userFetchStart}ms`);
      console.log(`[PROTECT] User found in DB:`, user);

      if (!user) {
        console.warn(`[PROTECT] ❌ No user with Clerk ID ${userId} found in DB`);
        return res.status(401).json({ message: "Unauthorized: User not found in DB" });
      }

      // Attach to request for downstream
      req.user = user;
      console.log(`[PROTECT] ✅ req.user attached to request:`, req.user);

      console.log(`[PROTECT] ✅ Completed in ${Date.now() - start}ms`);
      console.log(`========== [PROTECT MIDDLEWARE END] ${new Date().toISOString()} ==========\n`);
      next();
    } catch (error) {
      console.error(`[PROTECT] ❌ Error occurred:`, error);
      res.status(500).json({ message: "Server error during authentication", error: error.message });
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
