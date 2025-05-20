import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
  });
  const config = {
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-pro-preview-05-06';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `generate travel plan for location:Tozeur, Tunisie, for 3days for couple with a cheap budget, give me a hotels options list with HotelName, HotelAdress, Price, hotel image url,geo coordinates, ratign, descriptions and suggest itinerary with placename,place details, place image url, geo goordinates, ticketpricing, time t traval each of the location for 3days with each day plan with best time to visit in JSON  format.
`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Here's a breakdown of the thought process to generate the Tozeur travel plan:

1.  **Understand the Core Request:**
    *   **Location:** Tozeur, Tunisia
    *   **Duration:** 3 days
    *   **Travelers:** Couple
    *   **Budget:** Cheap
    *   **Deliverables:**
        *   Hotel options list (Name, Address, Price, Image URL, Geo Coordinates, Rating, Description)
        *   3-day itinerary (Placename, Details, Image URL, Geo Coordinates, Ticket Pricing, Travel Time, Best Time to Visit)
        *   JSON format for the entire output.

2.  **Initial Brainstorming & Knowledge Retrieval (Tozeur):**
    *   **What is Tozeur known for?**
        *   Oasis, date palms
        *   Chott el Djerid (salt lake)
        *   Star Wars filming locations (Ong Jmel, Mos Espa)
        *   Traditional brick architecture (Ouled el Hadef)
        *   Desert landscapes, canyons (Chebika, Tamerza, Mides)
        *   Dar Cherait Museum (traditional life)
        *   Eden Palm (date palm museum)
        *   Lezard Rouge (old phosphate train - maybe too far/expensive for cheap budget, keep in mind)
    *   **Cheap Budget Considerations:**
        *   Hostels or budget guesthouses.
        *   Local transport (louages, taxis - negotiate!).
        *   Picnics or local eateries over fancy restaurants.
        *   Free or low-cost activities.
        *   Prioritize shared tours for desert excursions if self-drive is not an option (which it likely isn't for a cheap budget focused on minimizing car rental).

3.  **Hotel Selection Strategy (Cheap Budget):**
    *   Focus on guesthouses ("Dar"), budget hotels, or well-rated hostels.
    *   Search terms like "cheap hotels Tozeur," "budget accommodation Tozeur."
    *   Prioritize places with decent reviews that mention value for money.
    *   Aim for a price range (e.g., $20-$50/night).
    *   *Self-correction:* Finding *actual live* prices and image URLs for specific dates is beyond the scope of a static generation. I'll need to use placeholders or general examples and state that prices are indicative. I'll also use generic placeholder image URLs. Geo-coordinates can be approximated from Google Maps.

4.  **Itinerary Structuring (3 Days):**
    *   **Day 1: Arrival & Tozeur Town Exploration:**
        *   Settle in.
        *   Explore the Medina (Ouled el Hadef) - free.
        *   Visit the Tozeur Oasis (walk or calèche ride - calèche adds cost, walking is free).
        *   Dar Cherait Museum (moderate cost).
        *   Eden Palm (moderate cost).
        *   *Best time:* Morning/late afternoon to avoid midday heat.
    *   **Day 2: Mountain Oases & Chott el Djerid:**
        *   This will be the most "expensive" day due to transport. Look for shared 4x4 tours.
        *   Chebika, Tamerza, Mides (canyons, waterfalls).
        *   Chott el Djerid (salt flat) - especially for sunset/sunrise.
        *   *Best time:* Early morning start for oases, late afternoon for Chott el Djerid.
    *   **Day 3: Star Wars & Departure Prep:**
        *   Ong Jmel ("Camel Neck" rock).
        *   Mos Espa (Star Wars set).
        *   Again, shared 4x4 or negotiated taxi.
        *   Maybe some souvenir shopping.
        *   *Best time:* Morning to avoid heat.

5.  **Refining Itinerary Details:**
    *   **Travel Time:** Estimate based on typical tour durations or driving times between locations.
    *   **Ticket Pricing:** Some places are free (Medina, Chott el Djerid), some have entry fees (museums, Star Wars sets might have a small fee or be part of tour cost). Specify "Free" or "Part of tour package."
    *   **Place Details:** Brief, enticing descriptions.
    *   **Image URLs:** Use generic placeholders.
    *   **Geo Coordinates:** Approximate from Google Maps.
    *   **Best Time to Visit:** General advice (e.g., "morning to avoid heat," "sunset").

6.  **JSON Structure Design:**
    *   Top-level object: \`travelPlan\`
    *   Properties within \`travelPlan\`: \`locationInfo\`, \`budgetCategory\`, \`durationDays\`, \`travelerProfile\`, \`hotelOptions\`, \`dailyItinerary\`.
    *   \`hotelOptions\`: Array of hotel objects. Each hotel object with \`HotelName\`, \`HotelAddress\`, \`Price\`, \`HotelImageUrl\`, \`GeoCoordinates\` (nested object \`lat\`, \`lon\`), \`Rating\`, \`Description\`.
    *   \`dailyItinerary\`: Array of day objects. Each day object with \`day\`, \`dayTitle\`, \`bestTimeToVisitDay\`, \`activities\` (array).
    *   Each activity object: \`placeName\`, \`placeDetails\`, \`placeImageUrl\`, \`geoCoordinates\` (nested \`lat\`, \`lon\`), \`ticketPricing\`, \`estimatedTravelTime\`, \`bestTimeToVisitPlace\`.

7.  **Populating the JSON - Iteration and Detail Filling:**

    *   **Hotels:**
        *   *Example 1 (Budget Guesthouse):* Dar Yomma. Find address, approximate coordinates, make up a price, rating, description. Use placeholder image.
        *   *Example 2 (Slightly more, but still budget):* Hotel Ksar Rouge.
        *   *Example 3 (Very basic):* A generic "Hostel Tozeur" or find a real one if easily available.
        *   *Self-correction:* Ensure price descriptions match "cheap budget" (e.g., "Around $20-40 USD per night").

    *   **Day 1:**
        *   Ouled el Hadef: Free, walk around.
        *   Tozeur Oasis: Free to walk, calèche extra.
        *   Dar Cherait: ~10-15 TND.
    *   **Day 2:**
        *   Chebika, Tamerza, Mides: Tour package, estimate ~80-120 TND per person for a shared tour. Specify "Part of shared 4x4 tour package".
        *   Chott el Djerid: Free to visit, part of tour.
    *   **Day 3:**
        *   Ong Jmel & Mos Espa: Part of tour package, estimate ~60-100 TND per person or negotiate taxi.
        *   Local Market: Free to browse.

8.  **Adding Important Notes/Disclaimers:**
    *   Prices are estimates and can vary.
    *   Book tours locally for better deals.
    *   Negotiate taxi fares.
    *   Stay hydrated.
    *   Best time to visit Tozeur overall (spring/autumn).
    *   Image URLs are illustrative.

9.  **Final JSON Validation and Review:**
    *   Check for syntax errors (commas, brackets, quotes).
    *   Ensure all requested fields are present.
    *   Verify consistency in naming and structure.
    *   Read through descriptions to ensure they are helpful and accurate.
    *   Make sure the "cheap budget" aspect is reflected in suggestions. For example, suggesting a calèche ride but also mentioning walking as a free alternative. Suggesting shared tours over private ones.

This systematic approach helps ensure all requirements are met and the information is well-organized and plausible, even if some data (like live pricing or specific image URLs) needs to be generalized.`,
        },
        {
          text: `Okay, here's a cheap budget-friendly 3-day travel plan for a couple visiting Tozeur, Tunisia, in JSON format.

**Important Considerations for a Cheap Budget:**

*   **Accommodation:** Focus on guesthouses (Dars) or budget hotels. Prices are indicative.
*   **Food:** Eat at local restaurants and "gargottes" (small local eateries) rather than tourist-focused restaurants. A budget of 20-40 TND per person per day for food should be feasible.
*   **Transport:**
    *   Within Tozeur: Walking is best for the Medina and Oasis. Taxis are available; always agree on the price beforehand.
    *   Excursions (Mountain Oases, Star Wars): Look for shared 4x4 tours. Booking locally upon arrival can sometimes get you better deals than online pre-booking. Negotiate!
*   **Flexibility:** Be prepared to adjust plans based on local availability and pricing of tours.
*   **Currency:** Tunisian Dinar (TND). 1 USD ≈ 3.1 TND (check current rates).
*   **Best Time to Visit Tozeur:** October to April to avoid extreme summer heat. This plan assumes visiting during these cooler months.

\`\`\`json
{
  "travelPlan": {
    "locationInfo": {
      "city": "Tozeur",
      "country": "Tunisie",
      "description": "Tozeur is an oasis city in southwestern Tunisia, renowned for its vast palm grove, unique brick architecture, and as a gateway to desert adventures including Chott el Djerid and Star Wars film locations."
    },
    "budgetCategory": "Cheap",
    "durationDays": 3,
    "travelerProfile": "Couple",
    "hotelOptions": [
      {
        "HotelName": "Dar Yomma",
        "HotelAddress": "Quartier Ouled El Hadef, Tozeur 2200, Tunisia",
        "Price": "Approx. 80-150 TND per night (can vary)",
        "HotelImageUrl": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/3c/9a/32/dar-yomma.jpg?w=1200&h=-1&s=1",
        "GeoCoordinates": {
          "lat": 33.9205,
          "lon": 8.1335
        },
        "Rating": "4.5/5 (TripAdvisor)",
        "Description": "A charming traditional guesthouse in the heart of the Medina, offering an authentic experience with comfortable rooms and a lovely courtyard. Known for good value."
      },
      {
        "HotelName": "Résidence El Arich",
        "HotelAddress": "Route Touristique, Tozeur 2200, Tunisia",
        "Price": "Approx. 100-180 TND per night (can vary)",
        "HotelImageUrl": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/25887106.jpg?k=a8919766490cc06802d20c9ed2c405e32db0f693a03ac32064a97fcc06276b9a&o=&hp=1",
        "GeoCoordinates": {
          "lat": 33.9110,
          "lon": 8.1212
        },
        "Rating": "3.5/5 (TripAdvisor)",
        "Description": "A budget-friendly hotel with a pool, located on the tourist route. Offers basic but clean rooms, suitable for travelers looking for essential comforts."
      },
      {
        "HotelName": "Hotel Ksar Rouge",
        "HotelAddress": "Route de Nefta km 1, BP 112, Tozeur 2200, Tunisia",
        "Price": "Approx. 120-200 TND per night (can vary)",
        "HotelImageUrl": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/34595225.jpg?k=54e4c23ed651cb986480857a3cd64d22d9371198a8db68d708a123d63377f7ae&o=&hp=1",
        "GeoCoordinates": {
          "lat": 33.9234,
          "lon": 8.1175
        },
        "Rating": "3.5/5 (TripAdvisor)",
        "Description": "A well-known mid-range option often offering competitive prices. Features traditional architecture, a pool, and is a common base for desert tours."
      }
    ],
    "dailyItinerary": [
      {
        "day": 1,
        "dayTitle": "Arrival & Tozeur Medina Exploration",
        "bestTimeToVisitDay": "Morning for Medina, late afternoon for Oasis to avoid midday heat.",
        "activities": [
          {
            "placeName": "Ouled el Hadef (Tozeur Medina)",
            "placeDetails": "Explore the ancient medina with its unique yellow-brick architecture, narrow alleyways, and traditional craftsmanship. Get lost in its charm.",
            "placeImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Tozeur_old_city_medina.jpg/1200px-Tozeur_old_city_medina.jpg",
            "geoCoordinates": {
              "lat": 33.9208,
              "lon": 8.1330
            },
            "ticketPricing": "Free",
            "estimatedTravelTime": "N/A (arrival day, walk from hotel)",
            "bestTimeToVisitPlace": "Morning (9 AM - 12 PM) or late afternoon (4 PM - 6 PM)"
          },
          {
            "placeName": "Tozeur Oasis (Palmeraie)",
            "placeDetails": "Wander through the vast palm grove, one of Tunisia's largest. You can walk, rent a bicycle, or take a calèche (horse-drawn carriage - negotiate price, approx 20-30 TND).",
            "placeImageUrl": "https://www.tunisienumerique.com/wp-content/uploads/2020/07/tozeur-palmeraie-2.jpg",
            "geoCoordinates": {
              "lat": 33.9250,
              "lon": 8.1250
            },
            "ticketPricing": "Free to walk; Calèche ride extra.",
            "estimatedTravelTime": "15-20 mins walk from Medina",
            "bestTimeToVisitPlace": "Late afternoon (4 PM - 6 PM) for cooler temperatures and golden light."
          },
          {
            "placeName": "Dar Cherait Museum (Optional)",
            "placeDetails": "A private museum showcasing traditional Tunisian life, art, and crafts. Offers a glimpse into the region's heritage. Good if you have extra time and budget.",
            "placeImageUrl": "https://musees.inp.rnrt.tn/wp-content/uploads/2021/01/dar_cherait_1-scaled.jpg",
            "geoCoordinates": {
              "lat": 33.9120,
              "lon": 8.1215
            },
            "ticketPricing": "Approx. 10-15 TND",
            "estimatedTravelTime": "10 mins taxi from Medina",
            "bestTimeToVisitPlace": "Afternoon (2 PM - 5 PM)"
          }
        ]
      },
      {
        "day": 2,
        "dayTitle": "Mountain Oases & Chott el Djerid Sunset",
        "bestTimeToVisitDay": "Early morning start for mountain oases to maximize daylight and avoid heat; late afternoon for Chott el Djerid.",
        "activities": [
          {
            "placeName": "Chebika Oasis",
            "placeDetails": "A stunning mountain oasis with a spring, small waterfalls, and palm trees nestled in a canyon. Requires some walking/hiking. Often the first stop on a 4x4 tour.",
            "placeImageUrl": "https://www.tunisia-direct.com/wp-content/uploads/2021/12/chebika-oasis.jpg",
            "geoCoordinates": {
              "lat": 34.3200,
              "lon": 7.9400
            },
            "ticketPricing": "Part of shared 4x4 tour package (expect around 80-150 TND per person for the full day tour including Tamerza & Mides). Small entry fee might be separate (2-5 TND).",
            "estimatedTravelTime": "Approx. 1 hour drive from Tozeur (as part of tour)",
            "bestTimeToVisitPlace": "Morning (9 AM - 11 AM)"
          },
          {
            "placeName": "Tamerza Oasis & Grand Cascade",
            "placeDetails": "The largest mountain oasis in Tunisia, featuring a picturesque old abandoned village and a large (sometimes dry) waterfall. Offers beautiful views.",
            "placeImageUrl": "https://voyagesautourdumonde.fr/wp-content/uploads/2020/04/tamerza-oasis-voyagesautourdumonde.fr-10-scaled.jpg",
            "geoCoordinates": {
              "lat": 34.3780,
              "lon": 7.9460
            },
            "ticketPricing": "Part of shared 4x4 tour package.",
            "estimatedTravelTime": "20-30 mins drive from Chebika (as part of tour)",
            "bestTimeToVisitPlace": "Late morning (11 AM - 1 PM)"
          },
          {
            "placeName": "Mides Oasis & Canyon",
            "placeDetails": "Located near the Algerian border, Mides boasts a breathtaking canyon landscape, sometimes used in films. Walk along the canyon rim for spectacular views.",
            "placeImageUrl": "https://www.reves-nomades.fr/wp-content/uploads/2019/01/canyon-mides-tunisie.jpg",
            "geoCoordinates": {
              "lat": 34.4130,
              "lon": 7.9230
            },
            "ticketPricing": "Part of shared 4x4 tour package.",
            "estimatedTravelTime": "15-20 mins drive from Tamerza (as part of tour)",
            "bestTimeToVisitPlace": "Early afternoon (1 PM - 2:30 PM)"
          },
          {
            "placeName": "Chott el Djerid (Salt Lake)",
            "placeDetails": "Vast salt flat that creates stunning mirages. Stop for photos, especially at sunset when the colors are magical. Some parts have man-made salt formations.",
            "placeImageUrl": "https://lp-cms-production.imgix.net/2021-09/shutterstockRF_790133905.jpg?auto=format&q=75&w=1920",
            "geoCoordinates": {
              "lat": 33.7000,  // General area, specific stop points vary
              "lon": 8.4000
            },
            "ticketPricing": "Free (part of tour or accessible by road)",
            "estimatedTravelTime": "30-45 mins drive from Tozeur (en route back from mountain oases or as a separate trip)",
            "bestTimeToVisitPlace": "Sunset (4 PM - 6 PM depending on season)"
          }
        ]
      },
      {
        "day": 3,
        "dayTitle": "Star Wars Adventure & Departure Prep",
        "bestTimeToVisitDay": "Morning for Star Wars sites to avoid heat and crowds.",
        "activities": [
          {
            "placeName": "Ong Jmel (Camel Neck Rock & Star Wars Site)",
            "placeDetails": "Famous for its camel-neck shaped rock formation and as a filming location for Star Wars (Darth Maul's landing site). Offers panoramic desert views.",
            "placeImageUrl": "https://starwarslocations.com/media/ongjemel_001.jpg",
            "geoCoordinates": {
              "lat": 33.9910,
              "lon": 7.9080
            },
            "ticketPricing": "Part of shared 4x4 tour package (expect around 60-100 TND per person for Star Wars sites tour). Small entry fee might be separate (2-5 TND).",
            "estimatedTravelTime": "Approx. 45 mins - 1 hour drive from Tozeur (as part of tour)",
            "bestTimeToVisitPlace": "Morning (9 AM - 11 AM)"
          },
          {
            "placeName": "Mos Espa (Star Wars Set)",
            "placeDetails": "The largest preserved Star Wars film set, representing Anakin Skywalker's hometown on Tatooine. Wander among the iconic structures in the desert.",
            "placeImageUrl": "https://www.visittunisia.com/wp-content/uploads/2021/06/Mos-Espa-Site-Star-Wars.jpg",
            "geoCoordinates": {
              "lat": 33.9940,
              "lon": 7.8425
            },
            "ticketPricing": "Part of shared 4x4 tour package. Small entry fee might be separate (5-10 TND).",
            "estimatedTravelTime": "15-20 mins drive from Ong Jmel (as part of tour)",
            "bestTimeToVisitPlace": "Morning/Late morning (10 AM - 12 PM)"
          },
          {
            "placeName": "Local Market / Souvenir Shopping",
            "placeDetails": "Before departure (or if time permits), explore local markets in Tozeur for dates, spices, traditional crafts, and souvenirs. Practice your bargaining skills.",
            "placeImageUrl": "https://media-cdn.tripadvisor.com/media/photo-s/07/8c/21/01/marche-central.jpg",
            "geoCoordinates": {
              "lat": 33.9185, // Central Tozeur area
              "lon": 8.1340
            },
            "ticketPricing": "Free to browse, cost of items varies.",
            "estimatedTravelTime": "N/A (walkable within Tozeur town)",
            "bestTimeToVisitPlace": "Morning or late afternoon"
          }
        ]
      }
    ],
    "generalTips": [
      "Prices for hotels and tours are indicative and can fluctuate. Best to check current rates and book locally for tours if possible.",
      "Negotiate prices for taxis and souvenirs respectfully.",
      "Stay hydrated, especially during warmer months. Carry water.",
      "Dress modestly, especially when visiting religious sites or local areas.",
      "Learn a few basic French or Arabic phrases; it will be appreciated.",
      "For excursions, shared 4x4 tours are the most cost-effective. Ask at your hotel or local tour agencies.",
      "Confirm tour inclusions (e.g., lunch, water, entry fees) before booking."
    ]
  }
}
\`\`\``,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();