import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

function parseItinerary(rawText) {
  const lines = rawText.split('\n');
  const days = [];
  const hotels = [];
  const events = [];

  let currentDay = null;
  let mode = "days"; // can be 'days', 'hotels', or 'events'

  for (let line of lines) {
    line = line.trim();

    if (line === '**Hotels:**') {
      if (currentDay) days.push(currentDay);
      currentDay = null;
      mode = "hotels";
      continue;
    }

    if (line === '**Events:**') {
      if (currentDay) days.push(currentDay);
      currentDay = null;
      mode = "events";
      continue;
    }

    if (mode === "days") {
      const dayMatch = line.match(/\*\*Day \d+: (.+?)\*\*/);
      if (dayMatch) {
        if (currentDay) days.push(currentDay);
        currentDay = {
          title: `Day ${days.length + 1}: ${dayMatch[1].trim()}`,
          description: '',
          location: 'Tozeur',
          image: 'https://example.com/tozeur-placeholder.jpg',
          map: 'https://www.google.com/maps/place/Tozeur'
        };
        continue;
      }
      if (currentDay && line) {
        const cleanLine = line.replace(/^\* /, '- ');
        currentDay.description += (currentDay.description ? '\n' : '') + cleanLine;
      }
    }

    if (mode === "hotels" && line.startsWith('-')) {
      // Example line format:
      // - Name: Hotel Sultan, Address: 5 Avenue El Oued, Tozeur, Tunisia, Stars: 4
      const hotelLine = line.slice(2);
      const hotel = {};

      // Split by commas but ignore commas inside address by splitting on ', ' then parse each part
      const parts = hotelLine.split(/,(?![^()]*\))/); // basic split by comma (assuming no nested commas in parentheses)
      for (const part of parts) {
        const [key, ...rest] = part.split(':');
        if (key && rest.length > 0) {
          const keyNormalized = key.trim().toLowerCase();
          const value = rest.join(':').trim();

          if (keyNormalized === "name") hotel.name = value;
          else if (keyNormalized === "address") hotel.address = value;
          else if (keyNormalized === "stars") hotel.stars = value;
          else hotel[keyNormalized] = value; // fallback for any extra keys
        }
      }
      hotels.push(hotel);
    }

    if (mode === "events" && line.startsWith('-')) {
      // Example line format:
      // - Name: Festival of Tozeur, Date: Mid-June, Location: Tozeur City
      const eventLine = line.slice(2);
      const event = {};

      const parts = eventLine.split(/,(?![^()]*\))/);
      for (const part of parts) {
        const [key, ...rest] = part.split(':');
        if (key && rest.length > 0) {
          const keyNormalized = key.trim().toLowerCase();
          const value = rest.join(':').trim();

          if (keyNormalized === "name") event.name = value;
          else if (keyNormalized === "date") event.date = value;
          else if (keyNormalized === "location") event.location = value;
          else event[keyNormalized] = value; // fallback for extras
        }
      }
      events.push(event);
    }
  }

  if (currentDay) days.push(currentDay);

  return { days, hotels, events };
}

router.post("/", async (req, res) => {
  let { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  // Inject strict formatting instructions into the prompt
  const formatInstructions = `
Please follow this exact format for your response:

**Day 1: Title**
* Morning: ...
* Afternoon: ...
* Evening: ...

**Day 2: Title**
...

**Hotels:**
- Name: ..., Address: ..., Stars: ...

**Events:**
- Name: ..., Date: ..., Location: ...
`;

  // Append formatting instructions to user's prompt
  prompt = prompt.trim() + "\n\n" + formatInstructions;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: "No response content from Groq API" });
    }

    const parsedItinerary = parseItinerary(content);

    return res.json({
      reply: content,
      itinerary: parsedItinerary,
    });
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Groq API failed" });
  }
});

export default router;
