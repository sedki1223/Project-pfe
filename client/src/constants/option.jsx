export const SelectTravelersList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A solo traveler in exploration',
    icon: '🧍', // Replace with an actual icon component if needed
    people: '1',
  },
  {
    id: 2,
    title: 'Couple',
    desc: 'A romantic escape for two',
    icon: '👫',
    people: '2',
  },
  {
    id: 3,
    title: 'Family',
    desc: 'Fun time with the whole family',
    icon: '👨‍👩‍👧‍👦',
    people: '4+',
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'Group of friends traveling together',
    icon: '🧑‍🤝‍🧑',
    people: '3+',
  },
  {
    id: 5,
    title: 'Business',
    desc: 'A professional business trip',
    icon: '💼',
    people: '1-2',
  },
]

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Budget Friendly',
    desc: 'Save money and still enjoy the experience',
    icon: '💸', // Replace with icon component if needed
    range: '$ - Under $500',
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'A balanced trip with comfort and savings',
    icon: '💰',
    range: '$$ - $500 to $1500',
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Premium experience with high-end services',
    icon: '💎',
    range: '$$$ - $1500+',
  },
  {
    id: 4,
    title: 'All-Inclusive',
    desc: 'Pay once, enjoy everything without worry',
    icon: '🎁',
    range: 'Varies - All packages included',
  },
]



export const AI_PROMPT = `
You are a professional travel planner assistant.

Based on the following information provided by a user, generate a personalized travel itinerary:
- Destination: [City or Country]
- Interests: [e.g., food, nature, culture]
- Duration: [e.g., 3 days]
- Budget: [Low, Mid, or Luxury]
- Travelers: [e.g., Solo, Couple, Family]

The itinerary should include:
1. Daily activity recommendations (morning, afternoon, evening)
2. Popular local spots or experiences
3. Suggestions that match the user's budget and interests
4. A friendly tone, clear structure, and organized day-by-day breakdown

Respond in markdown format with sections for each day.
`;


