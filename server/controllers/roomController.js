// controllers/roomController.js (FINAL CLEAN)

import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

// Create Room
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    // Validate hotel ownership
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found for this user." });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: "rooms" })
    );
    const uploadResults = await Promise.all(uploadPromises);
    const images = uploadResults.map(result => result.secure_url);

    if (!images.length) {
      return res.status(400).json({ success: false, message: "No images uploaded." });
    }

    // Create Room
    const room = await Room.create({
      hotel: hotel._id,
      name: roomType,
      price: Number(pricePerNight),
      capacity: 2, // default or adjust as needed
      amenities: JSON.parse(amenities),
      images,
      isAvailable: true,
    });

    res.status(201).json({ success: true, message: "Room created successfully.", room });
  } catch (error) {
    console.error("createRoom error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available rooms
export const getRooms = async (req, res) => {
  try {
    const { hotelName, hotelId } = req.query;
    const filter = { isAvailable: true };

    if (hotelName) {
      const hotel = await Hotel.findOne({ name: hotelName });
      if (!hotel) {
        return res.status(404).json({ success: false, message: "Hotel not found." });
      }
      filter.hotel = hotel._id;
    } else if (hotelId) {
      filter.hotel = hotelId;
    }

    const rooms = await Room.find(filter)
      .populate({ path: "hotel", populate: { path: "owner", select: "name image" } })
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("getRooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get rooms for hotel owner
export const getOwnerRooms = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found for owner." });
    }

    const rooms = await Room.find({ hotel: hotel._id }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    console.error("getOwnerRooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found." });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({ success: true, message: "Room availability toggled.", room });
  } catch (error) {
    console.error("toggleRoomAvailability error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get room by ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate({
      path: "hotel",
      populate: { path: "owner", select: "name image" }
    });

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found." });
    }

    res.json({ success: true, room });
  } catch (error) {
    console.error("getRoomById error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};