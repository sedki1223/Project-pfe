import mongoose from "mongoose";

const foodOrderSchema = new mongoose.Schema(
  {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "Dish", required: true },  
  quantity: Number,
  totalPrice: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online"],
      default: "Cash on Delivery",
    },
  },
  {
    timestamps: true,
  }
);

const FoodOrder = mongoose.model("FoodOrder", foodOrderSchema);

export default FoodOrder;
