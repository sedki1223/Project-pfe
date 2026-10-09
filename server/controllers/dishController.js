// controllers/dishesController.js

import Dish from "../models/Dish.js";
import Restaurant from "../models/restaurant.js";
import { v2 as cloudinary } from "cloudinary";

// Create Dish (multi-image, ownership validated)
export const createDish = async (req, res) => {
  try {
    const { name, price, description = "", category, ingredients } = req.body;

    // Validate restaurant ownership
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found for this user." });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: "dishes" })
    );
    const uploadResults = await Promise.all(uploadPromises);
    const images = uploadResults.map(result => result.secure_url);

    if (!images.length) {
      return res.status(400).json({ success: false, message: "No images uploaded." });
    }

    const parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    const dish = await Dish.create({
      restaurant: restaurant._id,
      name,
      price: Number(price),
      description,
      category,
      ingredients: parsedIngredients || [],
      images,
      isAvailable: true,
    });

    res.status(201).json({ success: true, message: "Dish created successfully.", dish });
  } catch (error) {
    console.error("createDish error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available dishes
export const getDishes = async (req, res) => {
  try {
    const { restaurantName, restaurantId } = req.query;
    const filter = { isAvailable: true };

    if (restaurantName) {
      const restaurant = await Restaurant.findOne({ name: restaurantName });
      if (!restaurant) {
        return res.status(404).json({ success: false, message: "Restaurant not found." });
      }
      filter.restaurant = restaurant._id;
    } else if (restaurantId) {
      filter.restaurant = restaurantId;
    }

    const dishes = await Dish.find(filter)
      .populate({ path: "restaurant", populate: { path: "owner", select: "name image" } })
      .sort({ createdAt: -1 });

    res.json({ success: true, dishes });
  } catch (error) {
    console.error("getDishes error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dishes for restaurant owner
export const getOwnerDishes = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found for owner." });
    }

    const dishes = await Dish.find({ restaurant: restaurant._id }).populate("restaurant");
    res.json({ success: true, dishes });
  } catch (error) {
    console.error("getOwnerDishes error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle dish availability
export const toggleDishAvailability = async (req, res) => {
  try {
    const { dishId } = req.body;
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found." });
    }

    dish.isAvailable = !dish.isAvailable;
    await dish.save();

    res.json({ success: true, message: "Dish availability toggled.", dish });
  } catch (error) {
    console.error("toggleDishAvailability error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dish by ID
export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate({
      path: "restaurant",
      populate: { path: "owner", select: "name image" }
    });

    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found." });
    }

    res.json({ success: true, dish });
  } catch (error) {
    console.error("getDishById error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
