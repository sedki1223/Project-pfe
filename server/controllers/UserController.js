// GET /api/user/
// Returns the role of the authenticated user
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    res.json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/user/recently-used-hotels
// Stores a hotel ID in the user's recentlyUsedHotels list
export const storeRecentlyUsedHotels = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res.status(400).json({ success: false, message: "Hotel ID is required" });
    }

    if (!req.user.recentlyUsedHotels) {
      req.user.recentlyUsedHotels = [];
    }

    if (!req.user.recentlyUsedHotels.includes(hotelId)) {
      req.user.recentlyUsedHotels.push(hotelId);
      await req.user.save();
    }

    res.json({ success: true, message: "Hotel added to recently used" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/user/recently-used-foods
// Stores a food ID in the user's recentlyUsedFoods list
export const storeRecentlyUsedFoods = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({ success: false, message: "Food ID is required" });
    }

    if (!req.user.recentlyUsedFoods) {
      req.user.recentlyUsedFoods = [];
    }

    if (!req.user.recentlyUsedFoods.includes(foodId)) {
      req.user.recentlyUsedFoods.push(foodId);
      await req.user.save();
    }

    res.json({ success: true, message: "Food item added to recently used" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
