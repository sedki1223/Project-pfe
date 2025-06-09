import User from "../models/User.js";

export default async function clerkWebhooks(req, res) {
  const { type, data } = req.body;

  console.log("📦 Data received:", req.body);

  try {
    if (type === "user.created") {
      const email = data.email_addresses?.[0]?.email_address;
      const image = data.image_url;
      const clerkId = data.id;
      const username = email.split("@")[0]; // or use another strategy

      if (!email || !clerkId || !image) {
        console.error("❌ Missing required user data");
        return res.status(400).send("Missing data");
      }

      const newUser = await User.create({
        clerkId,
        username,
        email,
        image,
      });

      console.log("✅ New user saved:", newUser.email);
      return res.status(200).send("user.created handled");
    }

    return res.status(200).send("Event received");
  } catch (err) {
    console.error("❌ Failed to save user:", err.message);
    return res.status(500).send("Internal Server Error");
  }
}
