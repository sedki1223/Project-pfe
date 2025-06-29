import transporter from "../configs/nodeMailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


// Function to check if a booking is available
export const checkBookingAvailability = async ({ checkInDate, checkOutDate, roomId }) => {
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn) || isNaN(checkOut)) {
      throw new Error("Invalid date format");
    }

    const bookings = await Booking.find({
      room: roomId,
      checkIn: { $lte: checkOut },
      checkOut: { $gte: checkIn },
    });

    return bookings.length === 0;
  } catch (error) {
    console.error("Error checking booking availability:", error);
    return false;
  }
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, roomId } = req.body;

    if (!checkInDate || !checkOutDate || !roomId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const isAvailable = await checkBookingAvailability({ checkInDate, checkOutDate, roomId });

    return res.json({ success: true, isAvailable });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};



// API to create a booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
    console.log("Inside createBooking");
  console.log("Request body:", req.body);
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
    let totalPrice = roomData.price;

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

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Booking Confirmation",
      html: `
        <h1>Booking Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Thank you for booking with us!</p>
        <p>Here are your booking details:</p>
        <ul>
          <li><strong>Booking ID:</strong> booking ID: ${booking._id}</li>
          <li><strong>Hotel</strong>: ${roomData.hotel.name}</li>
          <li><strong>Room</strong>: ${roomData.name}</li>
          <li><strong>Check-in</strong>: ${checkInDate.toDateString()}</li>
          <li><strong>Check-out</strong>: ${checkOutDate.toDateString()}</li>
          <li><strong>Total Price</strong>: ${process.env.CURRENCY}${totalPrice}</li>
        </ul>
        <p>We are excited to host you at our hotel. Please let us know if you have any special requests or requirements.</p>
        <p>We look forward to welcoming you!</p>
        <p>Hotel Management Team</p>
        <p><strong>Note:</strong> This is an automated email, please do not reply.</p>
        <p>For any queries, please contact us at ${process.env.SUPPORT_EMAIL}.</p>  
        <p>Thank you for choosing us!</p>
      `,
    }

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to create booking" });
  }
};
// API to get all bookings of a user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: userObjectId })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("GetUserBookings Error:", error); // log full error object
    res.status(500).json({ success: false, message: error.message || "Failed to get user bookings" });
  }
};

// API to get all bookings of a hotel owner
// GET /api/bookings/hotel
export const getHotelBookings = async (req, res) => {
  try {
    // ✅ Use the MongoDB _id, not Clerk userId
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found for this user." });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    return res.json({
      success: true,
      dashboardData: { bookings, totalBookings, totalRevenue },
    });
  } catch (error) {
    console.error("[getHotelBookings] Error:", error);
    res.status(500).json({ success: false, message: "Failed to get hotel bookings." });
  }
};
