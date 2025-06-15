import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from './firebaseAdmin.js';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ New OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-trip', async (req, res) => {
  const { prompt, formData, user } = req.body;

  if (!prompt || !formData || !user?.uid || !user?.email) {
    return res.status(400).json({ error: 'Missing required data (prompt, formData, user)' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const tripText = completion.choices[0]?.message?.content;

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
    console.error('OpenAI or Firestore error:', err);
    res.status(500).json({ error: 'Failed to generate trip. Please try again later.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
