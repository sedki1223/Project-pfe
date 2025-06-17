import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

router.post('/generate-trip', async (req, res) => {
  // Create the OpenAI client here, so env var is read now
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const tripPlan = response.choices[0].message.content;
    res.status(200).json({ tripPlan });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to generate trip" });
  }
});

export default router;
