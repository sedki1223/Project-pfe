import User from "../models/User.js";

export default async function clerkWebhooks(req, res) {
  const { type, data } = req.body;

  console.log("📦 Data received:", req.body);

  try {
    if (type === "user.created") {
      const email = data.email_addresses?.[0]?.email_address;
      const image = data.image_url;
      const clerkId = data.id;
      const username = email?.split("@")[0];

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

    if (type === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address;
      const image = data.image_url;
      const clerkId = data.id;
      const username = email?.split("@")[0];

      if (!clerkId) {
        console.error("❌ Missing Clerk ID for update");
        return res.status(400).send("Missing Clerk ID");
      }

      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        { email, username, image },
        { new: true }
      );

      if (!updatedUser) {
        console.warn("⚠️ User not found for update");
        return res.status(404).send("User not found");
      }

      console.log("🔄 User updated:", updatedUser.email);
      return res.status(200).send("user.updated handled");
    }

    if (type === "user.deleted") {
      const clerkId = data.id;

      if (!clerkId) {
        console.error("❌ Missing Clerk ID for deletion");
        return res.status(400).send("Missing Clerk ID");
      }

      const deletedUser = await User.findOneAndDelete({ clerkId });

      if (!deletedUser) {
        console.warn("⚠️ User not found for deletion");
        return res.status(404).send("User not found");
      }

      console.log("🗑️ User deleted:", deletedUser.email);
      return res.status(200).send("user.deleted handled");
    }

    return res.status(200).send("Event received");
  } catch (err) {
    console.error("❌ Error handling webhook:", err.message);
    return res.status(500).send("Internal Server Error");
  }
}
