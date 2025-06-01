// GET /api/user/
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;

    res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/user/store-recent-used
export const storeRecentlyUsedHotels = async (req, res) => {
  try {
    const { hotelId } = req.body;

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID is required",
      });
    }

    const user = req.user;

    // Ensure user has recentlyUsedHotels array
    if (!Array.isArray(user.recentlyUsedHotels)) {
      user.recentlyUsedHotels = [];
    }

    // Add to front and ensure uniqueness
    user.recentlyUsedHotels = [
      hotelId,
      ...user.recentlyUsedHotels.filter((id) => id !== hotelId),
    ].slice(0, 5); // keep last 5 only

    await user.save();

    res.status(200).json({
      success: true,
      message: "Hotel added to recently used",
      recentlyUsedHotels: user.recentlyUsedHotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
