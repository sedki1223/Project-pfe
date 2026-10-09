// GET /api/user/
// Returns the role of the authenticated user
export const getUserData = async (req, res) => {
  console.log("===== GET /api/user START =====");
  console.log("✅ req.user object:", req.user);
  console.log("✅ req.auth object (if any):", req.auth);

  try {
    if (!req.user) {
      console.error("❌ req.user is undefined or null");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const role = req.user.role;
    console.log(`🔑 User role found: ${role}`);

    res.json({ success: true, role });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error inside /api/user route:", error);
    res.status(500).json({ success: false, message: error.message });
  }

  console.log("===== GET /api/user END =====");
};


// POST /api/user/recently-used-hotels
// Stores a hotel ID in the user's recentlyUsedHotels list
export const storeRecentlyUsedHotels = async (req, res) => {
  console.log("===== POST /api/user/recently-used-hotels START =====");
  console.log("✅ req.user object:", req.user);
  console.log("✅ req.body received:", req.body);

  try {
    const { hotelId } = req.body;

    if (!hotelId) {
      console.warn("⚠️ hotelId missing in request body");
      return res.status(400).json({ success: false, message: "Hotel ID is required" });
    }

    if (!req.user) {
      console.error("❌ req.user is undefined or null");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!req.user.recentlyUsedHotels) {
      console.log("ℹ️ recentlyUsedHotels array does not exist; initializing empty array");
      req.user.recentlyUsedHotels = [];
    } else {
      console.log("ℹ️ Current recentlyUsedHotels array:", req.user.recentlyUsedHotels);
    }

    if (!req.user.recentlyUsedHotels.includes(hotelId)) {
      console.log(`➕ Adding hotelId ${hotelId} to recentlyUsedHotels`);
      req.user.recentlyUsedHotels.push(hotelId);

      await req.user.save();
      console.log("💾 User document saved successfully");
    } else {
      console.log(`ℹ️ hotelId ${hotelId} already exists in recentlyUsedHotels`);
    }

    res.json({ success: true, message: "Hotel added to recently used" });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error inside /api/user/recently-used-hotels route:", error);
    res.status(500).json({ success: false, message: error.message });
  }

  console.log("===== POST /api/user/recently-used-hotels END =====");
};


// POST /api/user/recently-used-foods
// Stores a food ID in the user's recentlyUsedFoods list
export const storeRecentlyUsedFoods = async (req, res) => {
  console.log("===== POST /api/user/recently-used-foods START =====");
  console.log("✅ req.user object:", req.user);
  console.log("✅ req.body received:", req.body);

  try {
    const { foodId } = req.body;

    if (!foodId) {
      console.warn("⚠️ foodId missing in request body");
      return res.status(400).json({ success: false, message: "Food ID is required" });
    }

    if (!req.user) {
      console.error("❌ req.user is undefined or null");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!req.user.recentlyUsedFoods) {
      console.log("ℹ️ recentlyUsedFoods array does not exist; initializing empty array");
      req.user.recentlyUsedFoods = [];
    } else {
      console.log("ℹ️ Current recentlyUsedFoods array:", req.user.recentlyUsedFoods);
    }

    if (!req.user.recentlyUsedFoods.includes(foodId)) {
      console.log(`➕ Adding foodId ${foodId} to recentlyUsedFoods`);
      req.user.recentlyUsedFoods.push(foodId);

      await req.user.save();
      console.log("💾 User document saved successfully");
    } else {
      console.log(`ℹ️ foodId ${foodId} already exists in recentlyUsedFoods`);
    }

    res.json({ success: true, message: "Food item added to recently used" });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error inside /api/user/recently-used-foods route:", error);
    res.status(500).json({ success: false, message: error.message });
  }

  console.log("===== POST /api/user/recently-used-foods END =====");
};
