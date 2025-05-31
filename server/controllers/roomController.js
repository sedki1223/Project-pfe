import Hotel from "../models/Hotel";
import {v2 as cloudinary} from "cloudinary";
import Room from "../models/Room.js";

//api to create a room

export const createRoom = async (req, res) => {
    try {
        const {roomType, price, amenities,} = req.body;
        const hotel = await Hotel.findOne(req.user._id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        // upload room image to cloudinary
        const uploadImages = req.files.map(async(file) => {
            const response = await cloudinary.uploader.upload(file.path, {
                folder: "rooms",
            });
            return response;
        })
        //await for all images to be uploaded
        if (uploadImages.length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }
        await Promise.all(uploadImages)

        await Room.create({
            hotel: hotel._id,
            roomType,
            price: +pricePerNight,
            amenities : JSON.parse(amenities),
            images,

        });
        res.json({ success: true, message: "Room created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


//api to get all rooms

export const getRooms = async (req, res) => {
    try{
        const rooms = await Room.find({isAvailable: true}).populate({
            path: "hotel",
            populate:{ path: "owner", select: "image" }
        }).sort({ createdAt: -1 });
        res.json({ success: true, rooms });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//api to get all rooms for a hotel

export const getOwnerRooms = async (req, res) => {
    try{
        const hotelData = await Hotel({ owner: req.auth._id });
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//api to toggle room availability

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room availability toggled", room: roomData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}