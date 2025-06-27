export const createrestaurant = async (req, res) => {
  console.log("📥 Food Register API Hit: ", req.body);
  console.log("👤 User: ", req.user?._id);

  try {
    const { name, contact, address, city } = req.body;
    const owner = req.user._id;

    if (!name || !contact || !address || !city) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingRestaurant = await Restaurant.findOne({ owner });
    if (existingRestaurant) {
      return res.status(400).json({ success: false, message: "Restaurant already exists." });
    }

    const newRestaurant = await Restaurant.create({
      name,
      contact,
      address,
      city,
      owner,
    });

    await User.findByIdAndUpdate(owner, { role: "foodOwner" });

    res.json({ success: true, message: "Restaurant created successfully" });
  } catch (error) {
    console.error("❌ Error during restaurant creation:", error);
    res.status(500).json({ success: false, message: "Error adding restaurant", error: error.message });
  }
};
