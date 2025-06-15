import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const createHotel = async (req, res) => {
  console.log("📥 Hotel Register API Hit: ", req.body);
  console.log("👤 Authenticated User ID: ", req.user?._id);

  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Validate required fields
    if (!name || !address || !contact || !city) {
      console.warn("⚠️ Missing one or more required hotel fields.");
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingHotelByOwner = await Hotel.findOne({ owner });
    console.log("🔍 Existing hotel by this owner: ", existingHotelByOwner);

    if (existingHotelByOwner) {
      console.warn("❌ This user already owns a hotel.");
      return res.status(400).json({
        success: false,
        message: "You already registered a hotel.",
      });
    }

    const existingHotelByNameAndCity = await Hotel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });
    console.log("🔍 Hotel with same name and city: ", existingHotelByNameAndCity);

    if (existingHotelByNameAndCity) {
      console.warn("❌ Hotel with the same name exists in the same city.");
      return res.status(400).json({
        success: false,
        message: "A hotel with the same name already exists in this city.",
      });
    }

    const newHotel = await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
    });
    console.log("✅ New hotel created: ", newHotel);

    const updatedUser = await User.findByIdAndUpdate(owner, { role: "hotelOwner" }, { new: true });
    console.log("👤 User role updated to hotelOwner: ", updatedUser);

    res.json({
      success: true,
      message: "Hotel created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating hotel:", error); // full error stack trace
    res.status(500).json({
      success: false,
      message: "Error adding hotel",
      error: error.message,
    });
  }
};
