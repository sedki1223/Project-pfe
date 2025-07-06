// controllers/transportController.js
import Transport from '../models/transport.js'

// Create a new transport option
export const createTransport = async (req, res) => {
  try {
    const { type, destination, date, time, price, availableSeats } = req.body

    if (!type || !destination || !date || !time || !price || !availableSeats) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const newTransport = await Transport.create({
      type,
      destination,
      date,
      time,
      price,
      availableSeats,
    })

    res.status(201).json(newTransport)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Fetch transports with optional filters
// Fetch transports with optional filters (updated)
// controllers/transportController.js

export const getTransports = async (req, res) => {
  try {
    const { destination, date, type, time } = req.query;

    console.log('[DEBUG] Incoming query params:', { destination, date, type, time });

    const filters = {};

    // Destination: partial case-insensitive match
    if (destination) {
      filters.destination = { $regex: destination, $options: 'i' };
      console.log('[DEBUG] Added destination filter:', filters.destination);
    }

    // Type: exact match if provided and not 'All'
    if (type && type.toLowerCase() !== 'all') {
      filters.type = type.toLowerCase();
      console.log('[DEBUG] Added type filter:', filters.type);
    }

    // Date: range between start and end of day, parsed as UTC
    if (date) {
      // parse date explicitly as UTC start/end
      const dayStart = new Date(date + 'T00:00:00.000Z');
      const dayEnd = new Date(date + 'T23:59:59.999Z');

      filters.date = { $gte: dayStart, $lte: dayEnd };
      console.log('[DEBUG] Added date filter:', filters.date);
    }

    // Time: optional exact match
    if (time) {
      filters.time = time;
      console.log('[DEBUG] Added time filter:', filters.time);
    }

    // Perform the query
    const transports = await Transport.find(filters).sort({ date: 1, time: 1 });

    console.log('[DEBUG] Query filters:', filters);
    console.log('[DEBUG] Found transports count:', transports.length);

    res.json({
      success: true,
      count: transports.length,
      transports,
    });
  } catch (err) {
    console.error('[ERROR] getTransports:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// controllers/transportController.js
export const getTransportById = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id)
      .populate({
        path: 'reviews.user',
        select: 'name email', // pick fields to expose
      });

    if (!transport) {
      return res.status(404).json({ error: 'Transport not found' });
    }

    res.json(transport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const bookSeats = async (req, res) => {
  try {
    const transportId = req.params.id;
    const userId = req.user._id; // assuming you have auth middleware attaching user
    const { seats } = req.body;

    if (!seats || seats <= 0) {
      return res.status(400).json({ error: 'Invalid number of seats' });
    }

    const transport = await Transport.findById(transportId);
    if (!transport) {
      return res.status(404).json({ error: 'Transport not found' });
    }

    if (seats > transport.availableSeats) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Decrement available seats
    transport.availableSeats -= seats;

    // Add booking entry (optional tracking)
    transport.bookings.push({ user: userId, seats });

    await transport.save();

    res.json({ success: true, message: 'Booking successful', transport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const addReview = async (req, res) => {
  try {
    const transportId = req.params.id;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    const transport = await Transport.findById(transportId);
    if (!transport) {
      return res.status(404).json({ error: 'Transport not found' });
    }

    // Add new review
    transport.reviews.push({
      user: userId,
      rating,
      comment,
    });

    await transport.save();

    res.json({ success: true, message: 'Review added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id)
      .populate({
        path: 'reviews.user',
        select: 'name email', // pick fields to expose
      });

    if (!transport) {
      return res.status(404).json({ error: 'Transport not found' });
    }

    res.json(transport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};