const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('./firebaseAdmin');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

app.post('/generate-trip', async (req, res) => {
  const { prompt, formData, user } = req.body;

  if (!prompt || !formData || !user?.uid || !user?.email) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const tripText = completion.data.choices[0].message.content;

    const docRef = admin.firestore().collection('AiTrips').doc();
    await docRef.set({
      id: docRef.id,
      userId: user.uid,
      userEmail: user.email,
      userSelection: formData,
      tripData: tripText,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ tripId: docRef.id, tripText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate trip' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
