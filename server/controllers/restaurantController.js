import Restaurant from "../models/restaurant.js";
import User from "../models/User.js";

export const createRestaurant = async (req, res) => {
  console.log("📥 Restaurant Register API Hit:", req.body);
  console.log("👤 Authenticated User ID:", req.user?._id);

  try {
    const { name, contact, address, city } = req.body;
    const owner = req.user._id;

    // Validate required fields
    if (!name || !contact || !address || !city) {
      console.warn("⚠️ Missing one or more required restaurant fields.");
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if user already owns a restaurant
    const existingRestaurantByOwner = await Restaurant.findOne({ owner });
    console.log("🔍 Existing restaurant by this owner:", existingRestaurantByOwner);

    if (existingRestaurantByOwner) {
      console.warn("❌ This user already owns a restaurant.");
      return res.status(400).json({
        success: false,
        message: "You already registered a restaurant.",
      });
    }

    // Check if restaurant with same name and city exists
    const existingRestaurantByNameAndCity = await Restaurant.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });
    console.log("🔍 Restaurant with same name and city:", existingRestaurantByNameAndCity);

    if (existingRestaurantByNameAndCity) {
      console.warn("❌ Restaurant with the same name exists in the same city.");
      return res.status(400).json({
        success: false,
        message: "A restaurant with the same name already exists in this city.",
      });
    }

    // Create the restaurant
    const newRestaurant = await Restaurant.create({
      name,
      contact,
      address,
      city,
      owner,
    });
    console.log("✅ New restaurant created:", newRestaurant);

    // Update user role to restaurantOwner
    const updatedUser = await User.findByIdAndUpdate(owner, { role: "restaurantOwner" }, { new: true });
    console.log("👤 User role updated to restaurantOwner:", updatedUser);

    res.json({
      success: true,
      message: "Restaurant created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Error adding restaurant",
      error: error.message,
    });
  }
};
