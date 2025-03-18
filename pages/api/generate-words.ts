// pages/api/generate-words.ts
import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Strict word lists for different difficulties and themes
const WORD_CRITERIA = {
  beginner: {
    maxLength: 6,
    description: 'simple, common, single-syllable words',
    examples: 'cat, dog, run, jump, love, hate',
  },
  intermediate: {
    maxLength: 8,
    description: 'two-syllable words, common vocabulary',
    examples: 'running, jumping, faster, stronger',
  },
  advanced: {
    minLength: 7,
    description: 'complex multisyllabic words, sophisticated vocabulary',
    examples: 'extraordinary, magnificent, phenomenal',
  }
};

const THEME_CRITERIA = {
  street: {
    context: 'urban life, street culture, city living',
    examples: {
      beginner: 'grip, street, hood, real',
      intermediate: 'hustle, grinder, player',
      advanced: 'ambitious, tenacious, persevere',
    }
  },
  love: {
    context: 'relationships, emotions, feelings',
    examples: {
      beginner: 'heart, soul, kiss, love',
      intermediate: 'passion, caring, loving',
      advanced: 'devotion, cherishing, enamored',
    }
  },
  battle: {
    context: 'competition, confrontation, challenge',
    examples: {
      beginner: 'fight, win, beat, strong',
      intermediate: 'warrior, victor, battle',
      advanced: 'dominant, invincible, unstoppable',
    }
  },
  conscious: {
    context: 'social awareness, knowledge, wisdom',
    examples: {
      beginner: 'truth, mind, think, learn',
      intermediate: 'wisdom, knowledge, aware',
      advanced: 'enlightened, conscious, philosophical',
    }
  },
  party: {
    context: 'celebration, enjoyment, entertainment',
    examples: {
      beginner: 'dance, move, jump, fun',
      intermediate: 'grooving, dancing, party',
      advanced: 'celebrating, entertaining, energetic',
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { difficulty, theme, excludeWords } = req.body;

    // Validate inputs
    if (!WORD_CRITERIA[difficulty]) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }
    if (!THEME_CRITERIA[theme]) {
      return res.status(400).json({ error: 'Invalid theme' });
    }

    const difficultyParams = WORD_CRITERIA[difficulty];
    const themeParams = THEME_CRITERIA[theme];

    const prompt = `
      Generate a single word for freestyle rap that strictly follows these criteria:

      Difficulty Level (${difficulty}):
      - ${difficultyParams.description}
      ${difficultyParams.maxLength ? `- Maximum length: ${difficultyParams.maxLength} characters` : ''}
      ${difficultyParams.minLength ? `- Minimum length: ${difficultyParams.minLength} characters` : ''}
      - Similar to: ${difficultyParams.examples}

      Theme (${theme}):
      - Context: ${themeParams.context}
      - Should fit theme examples like: ${themeParams.examples[difficulty]}

      Additional Requirements:
      - Word must be appropriate for rap lyrics
      - Must not be in the excluded list: ${excludeWords.join(', ')}
      - Return ONLY the word, no punctuation or explanation
      - Must be a real, commonly used English word
      - Must fit both the difficulty AND theme criteria strictly

      Example format: word
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a specialized rap word generator. You only respond with single, appropriate words that strictly match the given criteria. Never include punctuation or explanation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 5,
      presence_penalty: 0.6,
      frequency_penalty: 0.8,
    });

    let word = completion.choices[0].message.content
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z]/g, '');

    // Validate the generated word
    if (!word) {
      throw new Error('No valid word generated');
    }

    // Check word length criteria
    if (difficultyParams.maxLength && word.length > difficultyParams.maxLength) {
      throw new Error('Generated word exceeds maximum length');
    }
    if (difficultyParams.minLength && word.length < difficultyParams.minLength) {
      throw new Error('Generated word is too short');
    }

    // Check if word is in exclude list
    if (excludeWords.includes(word)) {
      throw new Error('Generated word is in exclude list');
    }

    res.status(200).json({ words: [word] });
  } catch (error) {
    console.error('Word generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate word',
      details: error.message 
    });
  }
}