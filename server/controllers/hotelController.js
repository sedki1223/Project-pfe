import Hotel from "../models/Hotel.js";    
import User from "../models/User.js";

export const createHotel = async (req, res) => {
  try {
    const { name, address, contact, price, rating, amenities } = req.body;
    const owner = req.user._id

    if(Hotel){
        return res.status(400).json({ success: false, message: "Hotel already exists" });
    }
    await Hotel.create({
      name,
      address,
      contact,
      owner,
      price,
      rating,
      amenities
    });
    await User.findByIdAndUpdate(
      owner,
      {role: "hotelOwner"},
    );
    res.json({ success: true, message: "Hotel created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}
