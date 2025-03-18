// pages/api/analyze-speech.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { duration } = req.body;

    // Mock analytics since we're not actually processing audio
    const analyticsData = {
      duration,
      wordsPerMinute: Math.round(Math.random() * 100 + 50),
      uniqueWords: Math.round(Math.random() * 30 + 20),
      totalWords: Math.round(Math.random() * 50 + 40),
      timestamp: new Date()
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze speech' });
  }
}