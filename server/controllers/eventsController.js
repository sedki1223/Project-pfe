// controllers/eventController.js
import Event from '../models/Events.js'
import { v2 as cloudinary } from "cloudinary"; // adjust path as needed


export const createEvent = async (req, res) => {
  try {
    const { title, description, location, price, date, category, time } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
    }

    const event = await Event.create({
      title,
      description,
      location,
      price,
      date,
      category,
      time,
      imageUrl: imageUrls, // save array of URLs
      attendees: [],
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const { id } = req.params
    const event = await Event.findById(id).select('attendees')
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.json(event.attendees)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// Cancel RSVP
export const cancelRsvpToEvent = async (req, res) => {
  const { id } = req.params
  const { id: userId } = req.user

  try {
    const event = await Event.findById(id)
    if (!event) return res.status(404).json({ error: 'Event not found' })

    const originalCount = event.attendees.length
    event.attendees = event.attendees.filter(a => a.userId !== userId)

    if (event.attendees.length === originalCount)
      return res.status(400).json({ error: 'You were not RSVPed' })

    await event.save()
    res.json({ message: 'RSVP canceled', attendees: event.attendees })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// RSVP to an event
export const rsvpToEvent = async (req, res) => {
  const { id } = req.params
  const { id: userId, fullName, emailAddresses } = req.user
  const email = emailAddresses?.[0]?.emailAddress || ''

  try {
    const event = await Event.findById(id)
    if (!event) return res.status(404).json({ error: 'Event not found' })

    const alreadyJoined = event.attendees.some(a => a.userId === userId)
    if (alreadyJoined) return res.status(400).json({ error: 'Already RSVPed' })

    event.attendees.push({ userId, name: fullName, email })
    await event.save()

    res.json({ message: 'RSVP successful', attendees: event.attendees })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get attendees for an event

// Like an event
export const likeEvent = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (event.likedBy.includes(userId)) {
      return res.status(400).json({ success: false, message: "You have already liked this event." });
    }

    event.likesCount += 1;
    event.likedBy.push(userId);
    await event.save();

    res.json({ success: true, message: "Event liked", likesCount: event.likesCount });
  } catch (err) {
    console.error("likeEvent error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Unlike an event
export const unlikeEvent = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (!event.likedBy.includes(userId)) {
      return res.status(400).json({ success: false, message: "You have not liked this event." });
    }

    event.likesCount = Math.max(0, event.likesCount - 1);
    event.likedBy = event.likedBy.filter(uid => uid !== userId);
    await event.save();

    res.json({ success: true, message: "Like removed", likesCount: event.likesCount });
  } catch (err) {
    console.error("unlikeEvent error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// controllers/eventController.js

export const addEventReview = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Add new review
    event.reviews.push({
      user: userId,
      rating,
      comment,
    });

    await event.save();

    res.json({ success: true, message: 'Review added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
