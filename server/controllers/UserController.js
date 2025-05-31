//GET /api/user/

export const getUserData = async (req, res) => {
  try {
    
        const role = req.user.role;
        res.json({
            success: true, role 
        });
    
    }
    
  catch (error) {
    res.json({success: false, message: error.message });
    
  }
};

// store user Recently used hotels
export const storeRecentlyUsedHotels = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res.status(400).json({ success: false, message: "Hotel ID is required" });
    }

    // Ensure user has a recentlyUsedHotels array
    if (!req.user.recentlyUsedHotels) {
      req.user.recentlyUsedHotels = [];
    }

    // Add hotelId to the array if not already present
    if (!req.user.recentlyUsedHotels.includes(hotelId)) {
      req.user.recentlyUsedHotels.push(hotelId);
      await req.user.save();
    }

    res.json({ success: true, message: "Hotel added to recently used" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};