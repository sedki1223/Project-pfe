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
  (req, res, next) => {
    console.log('[PROTECT] Middleware triggered');
    next();
  },

  clerkRequireAuth(),

  async (req, res, next) => {
    console.log('[PROTECT] Authorization header:', req.headers.authorization);

    try {
      const authStart = Date.now();
      const auth = await req.auth();
      console.log(`[PROTECT] req.auth() returned in ${Date.now() - authStart}ms:`, auth);

      if (!auth || !auth.userId) {
        console.warn('[PROTECT] No userId in auth payload');
        return res.status(401).json({ message: 'Unauthorized: No userId' });
      }

      const userFetchStart = Date.now();
      const user = await User.findOne({ clerkId: auth.userId });
      console.log(`[PROTECT] User from DB fetched in ${Date.now() - userFetchStart}ms:`, user);

      if (!user) {
        console.warn('[PROTECT] User not found in DB');
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }

      req.user = user;
      console.log('[PROTECT] req.user attached:', req.user);

      next(); // MUST call next() here to continue middleware chain
    } catch (err) {
      console.error('[PROTECT] Error:', err);
      res.status(500).json({ message: 'Server error in protect middleware' });
    }
  }
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
