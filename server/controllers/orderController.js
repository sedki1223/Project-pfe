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

    const dish = await Dish.findById(foodId).populate("owner");
    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found" });
    }

    const totalPrice = dish.price * quantity;

    const newOrder = await FoodOrder.create({
      user: userId,
      food: foodId,
      quantity,
      totalPrice,
      deliveryAddress,
      contactNumber,
      paymentMethod: "Cash on Delivery",
    });

    const user = await User.findById(userId);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Order Confirmation",
      html: `
        <h1>Order Confirmation</h1>
        <p>Hello ${user.username || "Customer"},</p>
        <p>Thank you for your order!</p>
        <ul>
          <li><strong>Order ID:</strong> ${newOrder._id}</li>
          <li><strong>Dish:</strong> ${dish.name}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Total Price:</strong> ${process.env.CURRENCY}${totalPrice}</li>
          <li><strong>Delivery Address:</strong> ${deliveryAddress}</li>
        </ul>
        <p>Your order will be delivered shortly. For any issues, contact us at ${process.env.SUPPORT_EMAIL}.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

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
    const userId = req.user._id;
    const orders = await FoodOrder.find({ user: userId }).populate("food").sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to get user food orders" });
  }
};

// 📊 API to get orders for food vendor (owner)
// GET /api/foods/vendor-orders
export const getVendorFoodOrders = async (req, res) => {
  try {
    const dishes = await Dish.find({ owner: req.user._id });

    const dishIds = dishes.map(d => d._id);
    const orders = await FoodOrder.find({ food: { $in: dishIds } })
      .populate("user food")
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
    const dishes = await Dish.find({ owner: req.user._id });
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

    if (dish.owner.toString() !== req.user._id.toString()) {
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
