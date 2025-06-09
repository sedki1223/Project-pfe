import Restaurant from "../models/restaurant.js";    
import User from "../models/User.js";

export const createrestaurant = async (req, res) => {
  console.log("📥 Food Register API Hit: ", req.body);
  console.log("👤 User: ", req.user?._id);
  try {
    const { name, description, contact } = req.body;
    const owner = req.user._id;

    const existingFood = await Restaurant.findOne({ owner });

    if (existingFood) {
      return res.status(400).json({ success: false, message: "Food item already exists" });
    }

    await Restaurant.create({
      name,
      description,
      contact,
      owner,
    });

    await User.findByIdAndUpdate(owner, { role: "foodOwner" });

    res.json({ success: true, message: "Food item created successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error adding food item" });
  }
};
