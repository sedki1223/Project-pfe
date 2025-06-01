// GET /api/user
export const getUserData = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Extract and return role
    const role = req.user.role;
    return res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/user/recent-hotels
export const storeRecentlyUsedHotels = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { hotelId } = req.body;

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID is required",
      });
    }

    // Make sure recentlyUsedHotels is initialized
    if (!Array.isArray(req.user.recentlyUsedHotels)) {
      req.user.recentlyUsedHotels = [];
    }

    // Add hotelId if it's not already present
    if (!req.user.recentlyUsedHotels.includes(hotelId)) {
      req.user.recentlyUsedHotels.push(hotelId);
      // Ensure req.user is a Mongoose model instance
      await req.user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Hotel added to recently used",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
