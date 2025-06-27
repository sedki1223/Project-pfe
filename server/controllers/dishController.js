import Dish from "../models/Dish.js";
import Restaurant from "../models/restaurant.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new Dish
export const createDish = async (req, res) => {
  try {
    const { name, price, description = "", category, ingredients, restaurant } = req.body;

    if (!name || !price || !category || !restaurant) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "dishes",
    });

    const imageUrl = uploadResponse.secure_url;

    const parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    const newDish = await Dish.create({
      name,
      price: Number(price),
      description,
      category,
      ingredients: parsedIngredients || [],
      image: imageUrl,
      restaurant,
      isAvailable: true,
    });

    res.status(201).json({ success: true, message: "Dish created successfully", dish: newDish });
  } catch (error) {
    console.error("Create dish error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all dishes for restaurants owned by authenticated user
export const getOwnerDishes = async (req, res) => {
  try {
    const ownedRestaurants = await Restaurant.find({ owner: req.user._id }).select("_id");
    const restaurantIds = ownedRestaurants.map((r) => r._id);

    const dishes = await Dish.find({ restaurant: { $in: restaurantIds } }).sort({ createdAt: -1 });

    res.json({ success: true, dishes });
  } catch (error) {
    console.error("Get owner dishes error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available dishes with populated restaurant and owner info
export const getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ isAvailable: true })
      .populate({
        path: "restaurant",
        populate: {
          path: "owner",
          select: "username email image",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, dishes });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle dish availability (only for owners)
export const updateDishAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findById(id).populate("restaurant");
    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found" });
    }

    if (dish.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    dish.isAvailable = !dish.isAvailable;
    await dish.save();

    res.json({ success: true, message: "Dish availability updated", dish });
  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a dish by ID
export const getDishById = async (req, res) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findById(id).populate({
      path: "restaurant",
      populate: {
        path: "owner",
        select: "username email image",
      },
    });

    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found" });
    }

    res.json({ success: true, dish });
  } catch (error) {
    console.error("Error fetching dish:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
