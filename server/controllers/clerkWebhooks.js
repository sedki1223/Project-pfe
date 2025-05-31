import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  const body = req.body; // ✅ Fix is here
  console.log("📦 Data received:", body);

  try {
    switch (body.type) {
      case "user.created":
        const { id, email_addresses, username, image_url } = body.data;

        const newUser = new User({
          _id: id, // Clerk ID used as MongoDB _id
          username,
          email: email_addresses[0].email_address,
          image: image_url,
        });

        await newUser.save();
        console.log("✅ User created in MongoDB");
        break;

      case "user.deleted":
        await User.findByIdAndDelete(body.data.id);
        console.log("❌ User deleted from MongoDB");
        break;

      // You can add more webhook types here if needed
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error processing Clerk webhook:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

export default clerkWebhooks;
