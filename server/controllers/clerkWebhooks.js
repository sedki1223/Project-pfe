import User from "../models/User.js";
import {Webhook} from "svix"


export const clerkWebhooks = async (req, res) => {
  try{
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers ={
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
      
    };
    await whook.verify(JSON.stringify(req.body), headers);

    const {data, type} = req.body
    const userData ={
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address ,
      username: data.first_name+" "+data.last_name ,
      image: data.image_url,
     }
     switch(type){
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated": 
        await User.findOneAndUpdate({clerkId:data.id}, userData);
        break;
      case "user.deleted":
        await User.findOneAndDelete ({clerkId:data.id});
        break;
     }
     res.json({message: "Webhook processed successfully"});
  } catch (error) {
    console.error("Error processing Clerk webhook:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default clerkWebhooks;