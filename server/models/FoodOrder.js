import mongoose from "mongoose";

const foodOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food", // Make sure you have a Food model
      required: true,
    },
    restaurantOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Same logic as hotelOwner
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
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
