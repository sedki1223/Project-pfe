import Hotel from "../models/Hotel.js";    
import User from "../models/User.js";

export const createHotel = async (req, res) => {
  console.log("📥 Hotel Register API Hit: ", req.body);
  console.log("👤 User: ", req.user?._id);

  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Prevent same user from creating multiple hotels
    const existingHotelByOwner = await Hotel.findOne({ owner });
    if (existingHotelByOwner) {
      return res.status(400).json({
        success: false,
        message: "You already registered a hotel.",
      });
    }

    // Prevent same hotel name + city globally
    const existingHotelByNameAndCity = await Hotel.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }, // case-insensitive match
      city: { $regex: new RegExp(`^${city}$`, 'i') },
    });

    if (existingHotelByNameAndCity) {
      return res.status(400).json({
        success: false,
        message: "A hotel with the same name already exists in this city.",
      });
    }

    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
    });

    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({
      success: true,
      message: "Hotel created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Error adding hotel",
    });
  }
};
