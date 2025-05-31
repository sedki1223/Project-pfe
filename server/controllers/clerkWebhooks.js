import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    const { body } = req;

    console.log("📦 Data received:", body);

    const userData = body.data;

    const _id = userData.id;
    const email = userData.email_addresses?.[0]?.email_address;
    const image = userData.image_url || userData.profile_image_url;
    const username = userData.username || email?.split("@")[0]; // fallback if username is null

    if (!_id || !email || !image) {
      console.error("❌ Missing required user data");
      return res.status(400).json({ message: "Missing required user fields" });
    }

    // Check if user already exists to avoid duplicates
    const existingUser = await User.findOne({ _id });
    if (existingUser) {
      console.log("ℹ️ User already exists:", existingUser.email);
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = new User({
      _id: clerkId,
      email,
      image,
      username,
    });

    await newUser.save();

    console.log("✅ New user saved:", email);
    res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("❌ Error processing Clerk webhook:", error);
    res.status(500).json({ message: "Error saving user" });
  }
};

export default clerkWebhooks;
