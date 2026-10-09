// controllers/transportBookingController.js
import TransportBooking from "../models/TransportBooking.js";
import Transport from "../models/transport.js";

export const createTransportBooking = async (req, res) => {
  try {
    const { transportId, seats } = req.body;
    const user = req.user;

    if (!transportId || !seats) {
      return res.status(400).json({ success: false, message: "Missing transportId or seats" });
    }

    // Fetch transport to check availability and price
    const transport = await Transport.findById(transportId);
    if (!transport) {
      return res.status(404).json({ success: false, message: "Transport not found" });
    }

    if (seats > transport.availableSeats) {
      return res.status(400).json({ success: false, message: "Not enough seats available" });
    }

    const totalPrice = seats * transport.price;

    // Create booking
    const booking = await TransportBooking.create({
      user: user._id,
      transport: transport._id,
      seats,
      totalPrice,
    });

    // Update transport available seats
    transport.availableSeats -= seats;
    await transport.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error("createTransportBooking error:", error);
    res.status(500).json({ success: false, message: "Failed to create booking" });
  }
};

export const getUserTransportBookings = async (req, res) => {
  try {
    const bookings = await TransportBooking.find({ user: req.user._id })
      .populate("transport")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("getUserTransportBookings error:", error);
    res.status(500).json({ success: false, message: "Failed to get bookings" });
  }
};

export const cancelTransportBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await TransportBooking.findById(bookingId).populate("transport");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Mark booking as cancelled
    booking.status = "cancelled";
    await booking.save();

    // Restore seats to transport
    booking.transport.availableSeats += booking.seats;
    await booking.transport.save();

    res.json({ success: true, message: "Booking cancelled" });
  } catch (error) {
    console.error("cancelTransportBooking error:", error);
    res.status(500).json({ success: false, message: "Failed to cancel booking" });
  }
};
