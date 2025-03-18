// pages/api/rhymes.ts
import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

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
    const { word } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a rhyming words generator. Generate 5 words that rhyme with the given word. Return only the rhyming words separated by commas, no explanations."
        },
        {
          role: "user",
          content: `Generate 5 words that rhyme with "${word}". Return only the words, separated by commas.`
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 50,
    });

    const rhymes = completion.choices[0].message.content
      ?.split(',')
      .map(word => word.trim().toLowerCase().replace(/[^a-z]/g, ''))
      .filter(Boolean)
      .slice(0, 5);

    res.status(200).json({ rhymes });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate rhyming words' });
  }
}