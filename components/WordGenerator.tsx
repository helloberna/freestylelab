// components/WordGenerator.tsx
import { useState, useEffect } from 'react';

export default function WordGenerator() {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState(10);

  const generateWord = async () => {
    try {
      const response = await fetch('/api/generate-words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: 'general', difficulty: 'medium' }),
      });

      const data = await response.json();

      if (data.words && Array.isArray(data.words)) {
        // Take just one word from the array
        setCurrentWord(data.words[Math.floor(Math.random() * data.words.length)]);
        setCountdown(10); // Reset countdown
      } else {
        setError('Invalid word format received');
      }
    } catch (error) {
      console.error('Error generating word:', error);
      setError('Failed to generate word');
    }
  };

  useEffect(() => {
    let wordInterval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isGenerating) {
      generateWord(); // Generate first word immediately

      // Generate new word every 10 seconds
      wordInterval = setInterval(generateWord, 10000);

      // Countdown timer
      countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 10));
      }, 1000);
    }

    return () => {
      clearInterval(wordInterval);
      clearInterval(countdownInterval);
    };
  }, [isGenerating]);

  return (
    <div className="p-6 bg-surface rounded-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-primary">Word Generator</h2>
          {isGenerating && (
            <p className="text-secondary">Next word in: {countdown}s</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsGenerating(!isGenerating);
            if (!isGenerating) {
              setCurrentWord('');
              setCountdown(10);
            }
          }}
          className={`px-6 py-3 rounded-lg ${
            isGenerating ? 'bg-red-500' : 'bg-primary'
          } hover:opacity-90 transition-opacity font-bold`}
        >
          {isGenerating ? 'Stop' : 'Start'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {currentWord && (
        <div className="bg-background p-8 rounded-lg text-center shadow-lg">
          <span className="text-4xl font-bold animate-pulse block">
            {currentWord}
          </span>
        </div>
      )}
    </div>
  );
}