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

    // Initialize array if not present
    if (!req.user.recentlyUsedHotels) {
      req.user.recentlyUsedHotels = [];
    }

    // Add hotelId if not already included
    if (!req.user.recentlyUsedHotels.includes(hotelId)) {
      req.user.recentlyUsedHotels.push(hotelId);
      await req.user.save();
    }

    res.json({ success: true, message: "Hotel added to recently used" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
