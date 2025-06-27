import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
  
  username: {type: String,
  },
  email: {type: String,
    required: true,
  },
  image: {type: String,
    required: true,
  },
  role: {type: String,
    enum: ["user", "hotelOwner", "restaurantOwner","admin"],
    default: "user",
  },
  recentlyUsedHotels: [{type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel"
  }],
  recentlyUsedFoods: [{type: mongoose.Schema.Types.ObjectId,
    ref: "Food"
  }],
}, {
  timestamps: true,
});
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
