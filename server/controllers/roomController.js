import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

// API to create a room
export const createRoom = async (req, res) => {
  try {
    const { name, capacity, price, amenities } = req.body;

    if (!name || !capacity || !price) {
      return res.status(400).json({ success: false, message: "Name, capacity and price are required" });
    }

    const parsedCapacity = Number(capacity);
    const parsedPrice = Number(price);

    if (isNaN(parsedCapacity) || isNaN(parsedPrice)) {
      return res.status(400).json({ success: false, message: "Capacity and price must be numbers" });
    }

    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    const images = await Promise.all(
      req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "rooms" }).then((res) => res.secure_url)
      )
    );

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const room = await Room.create({
      hotel: hotel._id,
      name,
      capacity: parsedCapacity,
      price: parsedPrice,
      amenities: JSON.parse(amenities),
      images,
      isAvailable: true,
    });

    res.status(201).json({ success: true, message: "Room created successfully", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// API to get all available rooms with hotel and owner info populated
export const getRooms = async (req, res) => {
  try {
    const { hotelName, hotelId } = req.query;
    let filter = { isAvailable: true };

    if (hotelName) {
      const hotel = await Hotel.findOne({ name: hotelName });
      if (!hotel) {
        return res.status(404).json({ success: false, message: "Hotel not found" });
      }
      filter.hotel = hotel._id;
    } else if (hotelId) {
      filter.hotel = hotelId;
    }

    const rooms = await Room.find(filter).populate({
      path: "hotel",
      populate: { path: "owner", select: "image" }
    }).sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// API to get all rooms for hotels owned by the authenticated user
export const getOwnerRooms = async (req, res) => {
  try {
    console.log("User ID:", req.user._id);

    const hotelData = await Hotel.findOne({ owner: req.user._id });
    if (!hotelData) {
      console.log("No hotel found for owner:", req.user._id);
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    console.log("Hotel found:", hotelData._id);

    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");
    console.log("Rooms found:", rooms.length);

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("getOwnerRooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);

    if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();

    res.json({ success: true, message: "Room availability toggled", room: roomData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// API to get a room by ID (with hotel and owner info populated)
// GET /api/rooms/:id
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: "hotel",
        populate: { path: "owner", select: "image name" }
      });

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error) {
    console.error('Error getting room by ID:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
