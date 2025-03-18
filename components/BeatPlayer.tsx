// components/BeatPlayer.tsx
import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { FaVolumeUp, FaCompactDisc } from 'react-icons/fa';
import * as Slider from '@radix-ui/react-slider';

const BEATS = {
  hiphop: '/beats/Hip Hop Beats.mp3',
  lofi: '/beats/Lofi Beats.mp3',
  trap: '/beats/Trap Music.mp3'
};

interface BeatType {
  name: string;
  displayName: string;
  japaneseText: string;
  defaultBpm: number;
}

interface BeatPlayerProps {
  isPlaying: boolean;
  onBpmChange?: (bpm: number) => void;
}

const BEAT_INFO: Record<string, BeatType> = {
  hiphop: {
    name: 'hiphop',
    displayName: 'Hip Hop',
    japaneseText: 'ヒップホップ',
    defaultBpm: 90
  },
  lofi: {
    name: 'lofi',
    displayName: 'Lo-fi',
    japaneseText: 'ローファイ',
    defaultBpm: 85
  },
  trap: {
    name: 'trap',
    displayName: 'Trap',
    japaneseText: 'トラップ',
    defaultBpm: 140
  }
};

export default function BeatPlayer({ isPlaying, onBpmChange }: BeatPlayerProps) {
  const [currentBeat, setCurrentBeat] = useState<string>('hiphop');
  const [volume, setVolume] = useState(0.7);
  const [bpm, setBpm] = useState(BEAT_INFO.hiphop.defaultBpm);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const nextSoundRef = useRef<Howl | null>(null);

  const createHowl = (beatType: string, autoplay: boolean = false) => {
    setIsLoading(true);
    return new Howl({
      src: [BEATS[beatType]],
      loop: true,
      volume: volume,
      html5: false,
      preload: true,
      rate: bpm / BEAT_INFO[beatType].defaultBpm,
      autoplay: autoplay,
      onload: () => {
        setIsLoading(false);
        console.log(`${beatType} loaded`);
      },
      onloaderror: (id, error) => {
        setIsLoading(false);
        console.error(`Error loading ${beatType}:`, error);
      },
      onplay: () => console.log(`${beatType} playing`),
      onstop: () => console.log(`${beatType} stopped`),
      onend: () => console.log(`${beatType} ended`)
    });
  };

  useEffect(() => {
    soundRef.current = createHowl(currentBeat);
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (nextSoundRef.current) {
        nextSoundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.play();
      } else {
        soundRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    onBpmChange?.(bpm);
  }, [bpm, onBpmChange]);

  const changeBeat = (beatType: string) => {
    setIsLoading(true);
    nextSoundRef.current = createHowl(beatType, isPlaying);

    if (soundRef.current && isPlaying) {
      soundRef.current.fade(volume, 0, 500);
      if (nextSoundRef.current) {
        nextSoundRef.current.fade(0, volume, 500);
      }
    }

    setTimeout(() => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      soundRef.current = nextSoundRef.current;
      nextSoundRef.current = null;
      setIsLoading(false);
    }, 500);

    setCurrentBeat(beatType);
    setBpm(BEAT_INFO[beatType].defaultBpm);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (soundRef.current) {
      soundRef.current.volume(volumeValue);
    }
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(event.target.value);
    setBpm(newBpm);
    if (soundRef.current) {
      const rate = newBpm / BEAT_INFO[currentBeat].defaultBpm;
      soundRef.current.rate(rate);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="bg-surface/80 backdrop-blur-lg p-6 rounded-xl border border-neon-cyan/10">
        {/* Glowing border effect */}
        <div className="absolute inset-0 border border-neon-cyan/20 rounded-xl blur-sm"></div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
            <FaCompactDisc className="text-4xl text-neon-cyan animate-spin" />
          </div>
        )}

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6">
            <span className="text-sm text-neon-cyan block mb-1">ビート セレクション</span>
            Beat Selection
          </h2>

          <div className="flex flex-wrap gap-4 mb-8">
            {Object.values(BEAT_INFO).map((beat) => (
              <button
                key={beat.name}
                onClick={() => changeBeat(beat.name)}
                disabled={isLoading}
                className={`group relative px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 ${
                  currentBeat === beat.name 
                    ? 'bg-neon-cyan text-background shadow-lg shadow-neon-cyan/25 animate-neon-pulse' 
                    : 'bg-background/50 text-text-secondary hover:bg-neon-cyan/20 hover:text-neon-cyan'
                }`}
              >
                <span className="block text-xs mb-1 opacity-75">{beat.japaneseText}</span>
                <span className="block font-medium">{beat.displayName}</span>
                {currentBeat === beat.name && (
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-lg blur-md -z-10"></div>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center space-x-4">
                <span className="text-neon-cyan min-w-[4ch]">音量</span>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  defaultValue={[0.7]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                >
                  <Slider.Track className="bg-background relative grow rounded-full h-2 shadow-inner">
                    <Slider.Range className="absolute bg-neon-cyan rounded-full h-full shadow-glow" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white rounded-full hover:bg-gray-100 focus:outline-none shadow-lg shadow-neon-cyan/25 transition-transform hover:scale-110"
                    aria-label="Volume"
                  />
                </Slider.Root>
                <FaVolumeUp className="text-neon-cyan" />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center space-x-4">
                <span className="text-neon-cyan min-w-[4ch]">BPM</span>
                <div className="flex-1">
                  <input
                    type="range"
                    min={60}
                    max={200}
                    value={bpm}
                    onChange={handleBpmChange}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(77, 255, 245) 0%, rgb(77, 255, 245) ${((bpm - 60) / 140) * 100}%, rgba(77, 255, 245, 0.1) ${((bpm - 60) / 140) * 100}%)`
                    }}
                  />
                </div>
                <span className="text-text-secondary min-w-[3ch] text-right">{bpm}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}