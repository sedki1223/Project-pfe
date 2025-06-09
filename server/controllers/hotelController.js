import Hotel from "../models/Hotel.js";    
import User from "../models/User.js";

export const createHotel = async (req, res) => {
  console.log("📥 Hotel Register API Hit: ", req.body);
  console.log("👤 User: ", req.user?._id);

  try {
    // Check if user is attached by middleware
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user found in request" });
    }

    const { name, address, contact } = req.body;
    const owner = req.user._id;

    // Check if hotel already exists for this owner
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.status(400).json({ success: false, message: "Hotel already exists for this user" });
    }

    // Create new hotel
    const newHotel = await Hotel.create({
      name,
      address,
      contact,
      owner,
    });

    // Update user role to hotelOwner
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.status(201).json({ success: true, message: "Hotel created successfully", hotel: newHotel });
  } catch (error) {
    console.error("❌ Error adding hotel:", error);
    res.status(500).json({ success: false, message: "Error adding hotel" });
  }
};
