import Restaurant from "../models/restaurant.js";
import User from "../models/User.js";

export const createrestaurant = async (req, res) => {
  console.log("📥 Food Register API Hit: ", req.body);
  console.log("👤 User: ", req.user?._id);

  try {
    const { name, description, contact } = req.body;
    const owner = req.user._id;

    // Validate required fields
    if (!name || !description || !contact) {
      console.warn("⚠️ Missing required fields.");
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingFood = await Restaurant.findOne({ owner });
    console.log("🔍 Existing food for owner:", existingFood);

    if (existingFood) {
      console.warn("❌ Restaurant already exists for this owner.");
      return res.status(400).json({ success: false, message: "Restaurant already exists." });
    }

    const newRestaurant = await Restaurant.create({
      name,
      description,
      contact,
      owner,
    });
    console.log("✅ Restaurant created:", newRestaurant);

    const updatedUser = await User.findByIdAndUpdate(owner, { role: "foodOwner" }, { new: true });
    console.log("👤 User role updated:", updatedUser);

    res.json({ success: true, message: "Restaurant created successfully" });

  } catch (error) {
    console.error("❌ Error during restaurant creation:", error); // 🔥 log full error
    res.status(500).json({ success: false, message: "Error adding restaurant", error: error.message });
  }
};
