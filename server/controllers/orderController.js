import transporter from "../configs/nodeMailer.js";
import FoodOrder from "../models/FoodOrder.js";
import Dish from "../models/Dish.js";
import User from "../models/User.js";
import Restaurant from "../models/restaurant.js";

// ✅ API to create a food order
// POST /api/foods/order
export const createFoodOrder = async (req, res) => {
  console.log("📥 Food Order API Hit:", req.body);
  console.log("👤 Authenticated User ID:", req.user?._id);

  try {
    const { foodId, quantity, deliveryAddress, contactNumber } = req.body;
    const userId = req.user._id;

    // Validate fields
    if (!foodId || !quantity || !deliveryAddress || !contactNumber) {
      console.warn("⚠️ Missing one or more required fields for food order.");
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const dish = await Dish.findById(foodId).populate("restaurant");
    if (!dish) {
      console.warn("❌ Dish not found for provided ID.");
      return res.status(404).json({ success: false, message: "Dish not found." });
    }

    const totalPrice = dish.price * quantity;

    const newOrder = await FoodOrder.create({
      user: userId,
      foodItem: foodId,
      quantity,
      totalPrice,
      deliveryAddress,
      contactNumber,
      paymentMethod: "Cash on Delivery",
    });

    const user = await User.findById(userId);

    // Send confirmation email (optional)
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Food Order Confirmation",
      html: `
        <h1>Order Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Thank you for your order!</p>
        <ul>
          <li><strong>Dish:</strong> ${dish.name}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Total Price:</strong> ${process.env.CURRENCY}${totalPrice}</li>
        </ul>
        <p>Your order will be delivered to: ${deliveryAddress}</p>
        <p>We appreciate your business!</p>
        <p>Restaurant Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Food order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error placing food order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place food order.",
      error: error.message,
    });
  }
};

// ✅ Get all orders of the logged-in user
// GET /api/foods/my-orders
export const getUserFoodOrders = async (req, res) => {
  try {
    const userObjectId = req.user._id; 
    const orders = await FoodOrder.find({ user: userObjectId })
      .populate("foodItem")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("[getUserFoodOrders] Error:", error);
    res.status(500).json({ success: false, message: "Failed to get food orders." });
  }
};

// ✅ Get all food orders for a restaurant owner
// GET /api/foods/vendor-orders
export const getVendorFoodOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found for this user." });
    }

    const dishes = await Dish.find({ restaurant: restaurant._id });
    const dishIds = dishes.map(dish => dish._id);

    const orders = await FoodOrder.find({ foodItem: { $in: dishIds } })
      .populate("user foodItem")
      .sort({ createdAt: -1 });

    const validOrders = orders.filter(order => order.user);

    const totalOrders = validOrders.length;
    const totalRevenue = validOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: { orders: validOrders, totalOrders, totalRevenue },
    });
  } catch (error) {
    console.error("[getVendorFoodOrders] Error:", error);
    res.status(500).json({ success: false, message: "Failed to get vendor food orders." });
  }
};


// ✅ Get all dishes owned by the logged-in restaurant owner
// GET /api/foods/vendor-dishes
export const getVendorFoods = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found for this user." });
    }

    const dishes = await Dish.find({ restaurant: restaurant._id }).sort({ createdAt: -1 });

    res.json({ success: true, foods: dishes });
  } catch (error) {
    console.error("[getVendorFoods] Error:", error);
    res.status(500).json({ success: false, message: "Failed to get vendor dishes." });
  }
};

// ✅ Toggle dish availability
// PATCH /api/foods/:id/toggle-availability
export const toggleFoodAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findById(id).populate("restaurant");
    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found." });
    }

    if (dish.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    dish.isAvailable = !dish.isAvailable;
    await dish.save();

    res.json({
      success: true,
      message: "Dish availability toggled.",
      dish,
    });
  } catch (error) {
    console.error("[toggleFoodAvailability] Error:", error);
    res.status(500).json({ success: false, message: "Failed to update dish availability." });
  }
};

// Add this function to your OrderController.js

export const cancelFoodOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await FoodOrder.findById(orderId).populate('foodItem');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Order already cancelled.' });
    }

    order.status = 'cancelled';
    await order.save();

    // Optionally send cancellation emails here like you do in booking
    // Example:
    /*
    await sendEmail({
      to: order.user.email,
      subject: "Order Cancellation Confirmation",
      text: `Your order for ${order.foodItem.name} has been cancelled successfully.`,
    });
    */

    res.status(200).json({ success: true, message: 'Order cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling food order:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
