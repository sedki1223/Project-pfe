const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Configuration, OpenAIApi} = require("openai");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize OpenAI API with key from environment config
const configuration = new Configuration({
  apiKey: functions.config().openai.key,
});
const openai = new OpenAIApi(configuration);

// Create a callable Cloud Function for trip generation
exports.generateTrip = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to generate trip.",
    );
  }

  const {prompt, formData} = data;

  if (!prompt || !formData) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Prompt and formData are required.",
    );
  }

  try {
    // Call OpenAI API with the prompt
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{role: "user", content: prompt}],
      temperature: 0.7,
    });

    const tripText = completion.data.choices[0].message.content;

    // Save trip data in Firestore
    const userId = context.auth.uid;
    const tripDocRef = admin.firestore().collection("AiTrips").doc();

    await tripDocRef.set({
      userId,
      userEmail: context.auth.token.email,
      userSelection: formData,
      tripData: tripText,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      id: tripDocRef.id,
    });

    // Return trip id and trip text
    return {tripId: tripDocRef.id, tripText};
  } catch (error) {
    console.error("Error generating trip:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to generate trip. Please try again later.",
    );
  }
});
