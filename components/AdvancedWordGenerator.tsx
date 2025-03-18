// components/AdvancedWordGenerator.tsx
import { useState, useEffect, useRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

interface WordGeneratorProps {
  isPlaying: boolean;
  bpm: number;
  onPlayingChange: (playing: boolean) => void;
}

// Extensive fallback word lists
const FALLBACK_WORDS = {
  street: {
    beginner: [
      'street', 'hood', 'flow', 'rap', 'beat', 'grind', 'flex', 'crew', 'squad',
      'real', 'true', 'raw', 'fresh', 'dope', 'lit', 'vibe', 'swag', 'game',
      'code', 'life', 'mind', 'time', 'road', 'path', 'goal', 'move', 'chase'
    ],
    intermediate: [
      'hustle', 'grinder', 'motion', 'power', 'respect', 'rhythm', 'struggle',
      'movement', 'streets', 'project', 'culture', 'wisdom', 'vision', 'master',
      'flying', 'rising', 'walking', 'talking', 'making', 'taking', 'building',
      'growing', 'knowing', 'flowing', 'showing', 'moving', 'proving'
    ],
    advanced: [
      'persevere', 'accomplish', 'dedicated', 'motivated', 'elevation',
      'resilient', 'ambitious', 'visionary', 'authentic', 'innovative',
      'masterful', 'tenacious', 'relentless', 'influential', 'phenomenal',
      'legitimate', 'dominating', 'calculated', 'navigating', 'accelerate'
    ]
  },
  love: {
    beginner: [
      'heart', 'soul', 'love', 'care', 'hope', 'dream', 'feel', 'touch',
      'kiss', 'hold', 'warm', 'soft', 'sweet', 'dear', 'pure', 'true',
      'glow', 'shine', 'light', 'joy', 'peace', 'grace', 'faith', 'trust'
    ],
    intermediate: [
      'passion', 'feeling', 'emotion', 'healing', 'tender', 'gentle',
      'caring', 'loving', 'glowing', 'shining', 'beauty', 'wonder',
      'precious', 'perfect', 'devoted', 'forever', 'always', 'deeper',
      'closer', 'stronger', 'sweeter', 'warmer', 'brighter'
    ],
    advanced: [
      'affection', 'devotion', 'cherished', 'treasured', 'enamored',
      'enchanted', 'euphoric', 'passionate', 'embracing', 'radiating',
      'resonating', 'captivating', 'everlasting', 'beautiful', 'wonderful',
      'miraculous', 'harmonious', 'delightful', 'enchanting'
    ]
  },
  battle: {
    beginner: [
      'fight', 'win', 'beat', 'strong', 'blast', 'clash', 'spark', 'flame',
      'blaze', 'rage', 'force', 'might', 'power', 'speed', 'strike', 'hit',
      'punch', 'kick', 'slam', 'crash', 'bang', 'boom', 'rush', 'charge'
    ],
    intermediate: [
      'warrior', 'fighter', 'battle', 'victory', 'winning', 'crushing',
      'blazing', 'raging', 'rising', 'striking', 'charging', 'burning',
      'pushing', 'pulling', 'taking', 'making', 'breaking', 'shaking',
      'moving', 'proving', 'showing', 'growing', 'knowing', 'flowing'
    ],
    advanced: [
      'destroyer', 'dominant', 'ferocious', 'victorious', 'unleashed',
      'ferocious', 'merciless', 'relentless', 'invincible', 'unbeatable',
      'unstoppable', 'incredible', 'formidable', 'devastating', 'annihilate',
      'obliterate', 'demolishing', 'conquering', 'decimating', 'dominating'
    ]
  },
  conscious: {
    beginner: [
      'truth', 'wise', 'mind', 'think', 'learn', 'grow', 'know', 'see',
      'hear', 'feel', 'real', 'pure', 'clean', 'clear', 'free', 'peace',
      'love', 'light', 'hope', 'faith', 'truth', 'path', 'way', 'road'
    ],
    intermediate: [
      'wisdom', 'knowledge', 'thought', 'learning', 'growing', 'knowing',
      'seeing', 'feeling', 'thinking', 'rising', 'shining', 'glowing',
      'flowing', 'moving', 'proving', 'showing', 'teaching', 'reaching',
      'seeking', 'speaking', 'healing', 'dealing', 'reading', 'leading'
    ],
    advanced: [
      'conscious', 'enlightened', 'awakened', 'elevated', 'liberated',
      'illuminated', 'meditative', 'innovative', 'cognitive', 'perceptive',
      'reflective', 'introspect', 'philosophic', 'analytical', 'conceptual',
      'theoretical', 'metaphysical', 'intellectual', 'educational'
    ]
  },
  party: {
    beginner: [
      'fun', 'dance', 'move', 'groove', 'vibe', 'flow', 'glow', 'shine',
      'light', 'bright', 'loud', 'proud', 'wild', 'free', 'jump', 'pump',
      'spin', 'win', 'play', 'sway', 'rock', 'pop', 'drop', 'top'
    ],
    intermediate: [
      'party', 'dancing', 'moving', 'grooving', 'vibing', 'flowing',
      'glowing', 'shining', 'rising', 'flying', 'riding', 'sliding',
      'rolling', 'rocking', 'popping', 'dropping', 'jumping', 'pumping',
      'spinning', 'winning', 'playing', 'staying', 'making', 'taking'
    ],
    advanced: [
      'celebrate', 'energetic', 'explosive', 'euphoric', 'ecstatic',
      'fantastic', 'incredible', 'amazing', 'phenomenal', 'spectacular',
      'magnificent', 'sensational', 'remarkable', 'outstanding', 'extraordinary',
      'electrifying', 'mesmerizing', 'captivating', 'fascinating'
    ]
  }
};

const DIFFICULTY_LEVELS = {
  beginner: 'Simple, common words',
  intermediate: 'Moderate complexity',
  advanced: 'Complex, multisyllabic words'
};

const THEMES = {
  street: 'Street Culture',
  love: 'Love & Relationships',
  battle: 'Battle Rap',
  conscious: 'Conscious Rap',
  party: 'Party Vibes'
};

export default function AdvancedWordGenerator({ isPlaying, bpm, onPlayingChange }: WordGeneratorProps) {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [rhymeWords, setRhymeWords] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [theme, setTheme] = useState('street');
  const [countdown, setCountdown] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const usedWordsRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const getFallbackWord = () => {
    const themeWords = FALLBACK_WORDS[theme as keyof typeof FALLBACK_WORDS];
    const difficultyWords = themeWords[difficulty as keyof typeof themeWords];
    const availableWords = difficultyWords.filter(word => !usedWordsRef.current.has(word));

    if (availableWords.length === 0) {
      usedWordsRef.current.clear();
      return difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
    }

    return availableWords[Math.floor(Math.random() * availableWords.length)];
  };
  const generateWord = async () => {
      try {
        setError('');

        // Try API first
        const response = await fetch('/api/generate-words', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            difficulty, 
            theme,
            excludeWords: Array.from(usedWordsRef.current)
          }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();

        if (data.error || !data.words?.[0]) {
          throw new Error(data.error || 'No word generated');
        }

        const newWord = data.words[0].toLowerCase();

        if (usedWordsRef.current.has(newWord)) {
          throw new Error('Word already used');
        }

        setCurrentWord(newWord);
        usedWordsRef.current.add(newWord);
        retryCountRef.current = 0;

        // Try to get rhyming words
        try {
          const rhymeResponse = await fetch('/api/rhymes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word: newWord }),
          });

          if (rhymeResponse.ok) {
            const rhymeData = await rhymeResponse.json();
            const newRhymes = (rhymeData.rhymes || [])
              .filter((rhyme: string) => !usedWordsRef.current.has(rhyme.toLowerCase()))
              .slice(0, 5);
            setRhymeWords(newRhymes);
          }
        } catch (rhymeError) {
          console.error('Rhyme generation failed:', rhymeError);
          setRhymeWords([]);
        }

      } catch (error) {
        console.error('Word generation error:', error);

        // Use fallback word if API fails
        const fallbackWord = getFallbackWord();
        if (fallbackWord) {
          setCurrentWord(fallbackWord);
          usedWordsRef.current.add(fallbackWord);
          setRhymeWords([]); // Clear rhymes for fallback words
          retryCountRef.current = 0;
        } else {
          setError('No more available words. Please change theme or difficulty.');
          retryCountRef.current++;

          if (retryCountRef.current >= 3) {
            handleStop();
            setError('Word generation failed multiple times. Please try again.');
          }
        }
      }

      setCountdown(10);
    };

    useEffect(() => {
      if (isGenerating) {
        generateWord();

        timerRef.current = setInterval(generateWord, 10000);

        countdownTimerRef.current = setInterval(() => {
          setCountdown(prev => prev > 0 ? prev - 1 : 10);
        }, 1000);
      }

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
      };
    }, [isGenerating]);

    useEffect(() => {
      usedWordsRef.current.clear();
      if (isGenerating) {
        generateWord();
      }
    }, [difficulty, theme]);

    const handleStart = () => {
      setIsGenerating(true);
      onPlayingChange(true);
      usedWordsRef.current.clear();
      retryCountRef.current = 0;
      setError('');
    };

    const handleStop = () => {
      setIsGenerating(false);
      onPlayingChange(false);
      setCurrentWord('');
      setRhymeWords([]);
      setCountdown(10);
      setError('');
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };

    return (
      <div className="bg-surface/80 backdrop-blur-lg p-6 rounded-xl border border-neon-cyan/10">
        <Tabs.Root defaultValue="generator" className="flex flex-col gap-6">
          <Tabs.List className="flex gap-2 border-b border-white/10">
            <Tabs.Trigger
              value="generator"
              className="px-4 py-2 text-text-secondary hover:text-neon-cyan data-[state=active]:text-neon-cyan data-[state=active]:border-b-2 data-[state=active]:border-neon-cyan"
            >
              Generator
            </Tabs.Trigger>
            <Tabs.Trigger
              value="settings"
              className="px-4 py-2 text-text-secondary hover:text-neon-cyan data-[state=active]:text-neon-cyan data-[state=active]:border-b-2 data-[state=active]:border-neon-cyan"
            >
              Settings
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="generator" className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                {isGenerating && (
                  <p className="text-neon-cyan">Next word in: {countdown}s</p>
                )}
                <p className="text-xs text-text-secondary">
                  Words used: {usedWordsRef.current.size}
                </p>
              </div>
              <button
                onClick={isGenerating ? handleStop : handleStart}
                className={`px-6 py-3 rounded-lg ${
                  isGenerating 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-neon-cyan hover:bg-neon-cyan/90'
                } text-background transition-all duration-300 font-bold shadow-lg shadow-neon-cyan/25`}
              >
                {isGenerating ? 'Stop' : 'Start'}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-center bg-red-500/10 p-2 rounded">
                {error}
              </div>
            )}

            {currentWord && (
              <div className="space-y-4">
                <div className="bg-background/50 p-8 rounded-xl text-center shadow-lg border border-neon-cyan/10">
                  <span className="text-5xl font-bold text-text-primary">
                    {currentWord}
                  </span>
                </div>

                {rhymeWords.length > 0 && (
                  <div className="bg-background/30 p-4 rounded-xl border border-neon-cyan/10">
                    <h3 className="text-neon-cyan mb-2">Rhymes with:</h3>
                    <div className="flex flex-wrap gap-2">
                      {rhymeWords.map((word, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-background/50 rounded-lg text-sm text-text-secondary"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="settings" className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neon-cyan mb-2">Difficulty</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {Object.entries(DIFFICULTY_LEVELS).map(([level, desc]) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`p-4 rounded-lg transition-all duration-300 ${
                      difficulty === level
                        ? 'bg-neon-cyan text-background shadow-lg shadow-neon-cyan/25'
                        : 'bg-background/50 text-text-secondary hover:bg-neon-cyan/20 hover:text-neon-cyan'
                    }`}
                  >
                    <div className="font-bold capitalize">{level}</div>
                    <div className="text-sm opacity-75">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-neon-cyan mb-2">Theme</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(THEMES).map(([themeKey, themeName]) => (
                  <button
                    key={themeKey}
                    onClick={() => setTheme(themeKey)}
                    className={`p-4 rounded-lg transition-all duration-300 ${
                      theme === themeKey
                        ? 'bg-neon-cyan text-background shadow-lg shadow-neon-cyan/25'
                        : 'bg-background/50 text-text-secondary hover:bg-neon-cyan/20 hover:text-neon-cyan'
                    }`}
                  >
                    {themeName}
                  </button>
                ))}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    );
  }