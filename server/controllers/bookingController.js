import transporter from "../configs/nodeMailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";

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
    const user = req.user; // use full user object, not just id

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
      user: user._id,
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
        <p>Dear ${user.name || 'Valued Guest'},</p>
        <p>Thank you for booking with us!</p>
        <p>Here are your booking details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel</strong>: ${roomData.hotel.name}</li>
          <li><strong>Room</strong>: ${roomData.name}</li>
          <li><strong>Check-in</strong>: ${checkIn.toDateString()}</li>
          <li><strong>Check-out</strong>: ${checkOut.toDateString()}</li>
          <li><strong>Total Price</strong>: ${process.env.CURRENCY || '$'}${totalPrice}</li>
        </ul>
        <p>We are excited to host you at our hotel. Please let us know if you have any special requests or requirements.</p>
        <p>Hotel Management Team</p>
        <p><strong>Note:</strong> This is an automated email, please do not reply.</p>
        <p>For any queries, please contact us at ${process.env.SUPPORT_EMAIL || 'support@example.com'}.</p>  
      `,
    };

    // Send email without blocking booking creation
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Booking confirmation email sent:", info.messageId);
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
    }

    res.json({ success: true, message: "Booking created successfully" });

  } catch (error) {
    console.error("Booking creation error:", error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};

// API to get all bookings of a user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("GetUserBookings Error:", error);
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

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID." });
    }

    const booking = await Booking.findById(bookingId).populate("room").populate("user").populate("hotel");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to cancel this booking." });
    }

    const now = new Date();
    const checkInDate = new Date(booking.checkIn);

    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
    if (hoursUntilCheckIn <= 24) {
      return res.status(400).json({ error: "Cannot cancel booking within 24 hours of check-in." });
    }

    booking.status = "cancelled";
    await booking.save();

    // Free the room dates if you store them in the Room model
    const room = await Room.findById(booking.room._id);
    if (room && room.bookedDates) {
      room.bookedDates = room.bookedDates.filter(date =>
        !(date >= booking.checkIn && date < booking.checkOut)
      );
      await room.save();
    }

    // Send email notifications
// Send email to user
try {
  const userMailOptions = {
    from: process.env.SENDER_EMAIL,
    to: booking.user.email,
    subject: "Booking Cancellation Confirmation",
    html: `
      <h1>Booking Cancellation Confirmation</h1>
      <p>Dear ${booking.user.name || 'Valued Guest'},</p>
      <p>Your booking has been successfully cancelled. Here are the details:</p>
      <ul>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>Hotel:</strong> ${booking.hotel.name}</li>
        <li><strong>Room:</strong> ${room.name}</li>
        <li><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</li>
        <li><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</li>
        <li><strong>Total Price:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice}</li>
      </ul>
      <p>We hope to host you in the future. For any queries, please contact us at ${process.env.SUPPORT_EMAIL || 'support@example.com'}.</p>
      <p><strong>Note:</strong> This is an automated email, please do not reply.</p>
    `,
  };

  const userInfo = await transporter.sendMail(userMailOptions);
  console.log("Booking cancellation email sent to user:", userInfo.messageId);
} catch (emailError) {
  console.error("Failed to send booking cancellation email to user:", emailError);
}

// Send email to hotel
try {
  const hotelMailOptions = {
    from: process.env.SENDER_EMAIL,
    to: booking.hotel.email,
    subject: "Booking Cancelled by User",
    html: `
      <h1>Booking Cancelled by User</h1>
      <p>User <strong>${booking.user.name || 'User'}</strong> has cancelled their booking. Here are the details:</p>
      <ul>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>Hotel:</strong> ${booking.hotel.name}</li>
        <li><strong>Room:</strong> ${room.name}</li>
        <li><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</li>
        <li><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</li>
        <li><strong>Total Price:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice}</li>
      </ul>
      <p>Note: This is an automated email, please do not reply.</p>
    `,
  };

  const hotelInfo = await transporter.sendMail(hotelMailOptions);
  console.log("Booking cancellation email sent to hotel:", hotelInfo.messageId);
} catch (emailError) {
  console.error("Failed to send booking cancellation email to hotel:", emailError);
}
    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("CancelBooking Error:", error);
    res.status(500).json({ success: false, message: "Failed to cancel booking" });
  } 
};