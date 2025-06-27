import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";            
import { db } from "../configs/firebaseAdminConfig.js"; 

dotenv.config();
const router = express.Router();

// --- INLINE formatInstructions FUNCTION ---
const formatInstructions = (days) => `
Generate a ${days}-day travel itinerary **only** for Tozeur, Tunisia. All activities, hotels, and events must be local to Tozeur or its surroundings.

Include visits to key places to visit in Tozeur such as Chebika Oasis, Jebel Douira, Souk El Attarine, Kasbah, Place du Peuple, and other cultural, historical, and natural landmarks.

**Follow this EXACT format** (do not deviate):

${Array.from({ length: days }, (_, i) => `**Day ${i + 1}: [Title]**
* Morning: [Detail – include place names, context, local highlights]
* Afternoon: [Detail – site, activity, local cuisine or historical info]
* Evening: [Detail – dinner spots, cultural events, ambiance]
* Image: [Direct URL to a relevant image representing the day's highlights]
`).join('')}

**Hotels:**
- Name: [Hotel Name], Address: [Full Address, Tozeur], Stars: [Rating], Map: [Google Maps URL], Image: [Hotel image URL]

**Events:**
- Name: [Event Name], Date: [e.g. "Daily at 7 PM", "Sept 10–12"], Location: [Venue in Tozeur], Map: [Google Maps URL], Image: [Event image URL]

**Example Output:**

**Day 1: Oasis Introduction**
* Morning: Arrive in Tozeur and check in at Hotel Ksar Hadada…
* Afternoon: Visit Chebika Oasis…
* Evening: Dinner at Restaurant La Kasbah…
* Image: https://example.com/images/oasis-intro.jpg

**Day 2: Oasis & Camels**
* Morning: Jebel Douira Oasis walk…
* Afternoon: Camel ride through palm groves…
* Evening: Hammam and dinner at Le Petit Prince…
* Image: https://example.com/images/camel-ride.jpg

**Hotels:**
- Name: Hotel Ksar Hadada, Address: Avenue de la République, 2200 Tozeur, Tunisia, Stars: 5‑star, Map: https://goo.gl/maps/xyz, Image: https://example.com/images/hotel-ksar.jpg
- Name: Le Hassiba, Address: Rue de …, Stars: 5‑star, Map: ..., Image: https://example.com/images/le-hassiba.jpg

**Events:**
- Name: Berber Dance Show, Date: Daily at 8 PM, Location: Place du 7 Novembre, Map: https://goo.gl/…, Image: https://example.com/images/berber-dance.jpg

Strictly no markdown other than the above; do not include bullet types outside “– ” and “* ”; do not include JSON or code blocks.
`;


// --- PARSER FUNCTION (unchanged except hotels/events regex improved) ---
function parseItinerary(rawText, userInterest = '') {
  const lines = rawText.split('\n');
  const days = [];
  const hotels = [];
  const events = [];

  let currentDay = null;
  let mode = null;

  const makeMapUrl = (query) => {
    if (!query) return 'https://www.google.com/maps';
    const encoded = encodeURIComponent(query);
    return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  };

  const matchesInterest = (text, interest) => {
    if (!interest) return true;
    return text.toLowerCase().includes(interest.toLowerCase());
  };

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Mode switches
    if (line.startsWith('**Hotels:**')) {
      if (currentDay) {
        days.push(currentDay);
        currentDay = null;
      }
      mode = "hotels";
      continue;
    }

    if (line.startsWith('**Events:**')) {
      if (currentDay) {
        days.push(currentDay);
        currentDay = null;
      }
      mode = "events";
      continue;
    }

    const dayMatch = line.match(/\*\*Day \d+: (.+?)\*\*/);
    if (dayMatch) {
      if (currentDay) {
        days.push(currentDay);
      }
      mode = "days";
      currentDay = {
        title: dayMatch[1].trim(),
        morning: '',
        afternoon: '',
        evening: '',
        location: 'Tozeur',
        image: 'https://example.com/tozeur-placeholder.jpg',
        map: 'https://www.google.com/maps/place/Tozeur',
      };
      continue;
    }

    if (mode === "days" && currentDay) {
      const morningMatch = line.match(/^\*\s*Morning:\s*(.+)/i);
      const afternoonMatch = line.match(/^\*\s*Afternoon:\s*(.+)/i);
      const eveningMatch = line.match(/^\*\s*Evening:\s*(.+)/i);

      if (morningMatch) {
        currentDay.morning = morningMatch[1].trim();
      } else if (afternoonMatch) {
        currentDay.afternoon = afternoonMatch[1].trim();
      } else if (eveningMatch) {
        currentDay.evening = eveningMatch[1].trim();
      }
      continue;
    }

    // Hotels
    if (mode === "hotels" && (line.startsWith('-') || line.startsWith('*'))) {
      let hotelLine = line.slice(1).trim();

      // Extract hotel name, address, stars, map
      const nameMatch = hotelLine.match(/Name:\s*([^,]+),?/i);
      const addressMatch = hotelLine.match(/Address:\s*([^,]+(?:, [^,]+)*),?/i);
      const starsMatch = hotelLine.match(/Stars:\s*([^,]+),?/i);
      const mapMatch = hotelLine.match(/Map:\s*(https?:\/\/\S+)/i);

      const hotel = {
        name: nameMatch ? nameMatch[1].trim() : '',
        address: addressMatch ? addressMatch[1].trim() : '',
        stars: starsMatch ? starsMatch[1].trim() : '',
        map: mapMatch ? mapMatch[1].trim() : makeMapUrl(addressMatch ? addressMatch[1] : nameMatch ? nameMatch[1] : ''),
      };

      hotels.push(hotel);
      continue;
    }

    // Events
    if (mode === "events" && (line.startsWith('-') || line.startsWith('*'))) {
      const eventLine = line.slice(1).trim();
      const event = {};
      const nameMatch = eventLine.match(/^Name:\s*([^,]+),/i);
      const dateMatch = eventLine.match(/Date:\s*([^,]+),?/i);
      const locationMatch = eventLine.match(/Location:\s*([^,]+),?/i);
      const mapMatch = eventLine.match(/Map:\s*(https?:\/\/\S+)/i);

      event.name = nameMatch ? nameMatch[1].trim() : '';
      event.date = dateMatch ? dateMatch[1].trim() : '';
      event.location = locationMatch ? locationMatch[1].trim() : '';
      event.map = mapMatch ? mapMatch[1].trim() : makeMapUrl(event.location || event.name);

      if (matchesInterest(event.name + ' ' + event.location, userInterest)) {
        events.push(event);
      }
      continue;
    }
  }

  if (currentDay) {
    days.push(currentDay);
  }

  return { days, hotels, events };
}



// --- MAIN ROUTE ---
router.post("/", async (req, res) => {
  let { prompt, userEmail } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  // Extract number of days
  const match = prompt.match(/(\d+)[\s-]*day/i);
  const days = match ? parseInt(match[1], 10) : 3;

  prompt = prompt.trim() + "\n\n" + formatInstructions(days);

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

    const tripId = uuidv4();

    await db.collection("AiTrips").doc(tripId).set({
      reply: content,
      itinerary: parsedItinerary,
      createdAt: new Date(),
      userEmail: userEmail || null,
    });

    return res.json({
      tripId,
      reply: content,
      itinerary: parsedItinerary,
    });
  } catch (error) {
    console.error("Groq API or Firestore error:", error.response?.data || error.message || error);
    return res.status(500).json({ error: "Groq API or Firestore failed" });
  }
});

export default router;
