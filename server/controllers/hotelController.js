import Hotel from "../models/Hotel.js";    
import User from "../models/User.js";

// Register/Create a new hotel
export const createHotel = async (req, res) => {
  try {
    const { name, address, contact, price, rating, amenities } = req.body;
    const owner = req.user._id;

    // Check if a hotel with the same name already exists
    const existingHotel = await Hotel.findOne({ name });
    if (existingHotel) {
      return res.status(400).json({ success: false, message: "Hotel already exists" });
    }

    // Create the hotel
    await Hotel.create({
      name,
      address,
      contact,
      owner,
      price,
      rating,
      amenities
    });

    // Update user role to hotelOwner
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
