import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


// Function to check if a booking is available
const checkBookingAvailability = async ({ checkInDate, checkOutDate, roomId }) => {
  try {
    const bookings = await Booking.find({
      room: roomId,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error("Error checking booking availability:", error);
    return false;
  }
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, roomId } = req.body;
    const isAvailable = await checkBookingAvailability({ checkInDate, checkOutDate, roomId });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to create a booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    // Check availability
    const isAvailable = await checkBookingAvailability({
      checkInDate,
      checkOutDate,
      roomId: room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available for the selected dates" });
    }

    // Get room and hotel data
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // Calculate total price based on number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice *= nights;

    // Create booking
    const booking = await Booking.create({
      user,
      hotel: roomData.hotel._id,
      room: roomData._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      guests: +guests,
      paymentMethod: "Pay at Hotel",
    });

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to create booking" });
  }
};

// API to get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user: user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to get user bookings" });
  }
};

// API to get all bookings of a hotel owner
// GET /api/bookings/hotel
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: { bookings, totalBookings, totalRevenue },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to get hotel bookings" });
  }
};
