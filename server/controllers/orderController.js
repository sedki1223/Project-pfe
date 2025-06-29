import transporter from "../configs/nodeMailer.js";
import FoodOrder from "../models/FoodOrder.js";
import Dish from "../models/Dish.js";
import User from "../models/User.js";

// 🛒 API to create a food order
// POST /api/foods/order
export const createFoodOrder = async (req, res) => {
  try {
    const { foodId, quantity, deliveryAddress, contactNumber } = req.body;
    const userId = req.user._id;

    const dish = await Dish.findById(foodId); // no populate needed for restaurantOwner
    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found" });
    }

    const totalPrice = dish.price * quantity;

    const newOrder = await FoodOrder.create({
      user: userId,
      foodItem: foodId,  // keep this to match schema field
      quantity,
      totalPrice,
      deliveryAddress,
      contactNumber,
      paymentMethod: "Cash on Delivery",
    });

    const user = await User.findById(userId);

    res.json({ success: true, message: "Food order placed successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to place food order" });
  }
};

// 🧾 API to get all orders of a user
// GET /api/foods/my-orders
export const getUserFoodOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.find({ user: req.user._id })
      .populate("foodItem")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("[getUserFoodOrders] Error:", error);
    res.status(500).json({ success: false, message: "Failed to get food orders." });
  }
};



// 📊 API to get orders for food vendor (owner)
// GET /api/foods/vendor-orders
export const getVendorFoodOrders = async (req, res) => {
  try {
    const dishes = await Dish.find({ restaurantOwner: req.user._id });

    const dishIds = dishes.map(d => d._id);
    const orders = await FoodOrder.find({ foodItem: { $in: dishIds } })
      .populate("user foodItem")
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: {
        orders,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to get vendor food orders" });
  }
};

// 🍽️ Get all dishes owned by the logged-in vendor (owner)
export const getVendorFoods = async (req, res) => {
  try {
    const dishes = await Dish.find({ restaurantOwner: req.user._id });
    res.json({ success: true, foods: dishes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get vendor dishes" });
  }
};

// 🔄 Update dish availability (or other editable fields)
export const updateFoodAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const dish = await Dish.findById(id);
    if (!dish) return res.status(404).json({ success: false, message: "Dish not found" });

    if (dish.restaurantOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    dish.isAvailable = isAvailable;
    await dish.save();

    res.json({ success: true, message: "Dish availability updated", food: dish });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update availability" });
  }
};
