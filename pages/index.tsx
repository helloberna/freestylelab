// pages/index.tsx
import { useState } from 'react';
import Header from '../components/Header';
import Background from '../components/Background';
import BeatPlayer from '../components/BeatPlayer';
import AdvancedWordGenerator from '../components/AdvancedWordGenerator';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(90);

  const handlePlayStateChange = (playing: boolean) => {
    setIsPlaying(playing);
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-x-hidden">
      {/* Background with grid and samurai */}
      <Background />

      {/* Main content */}
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Beat Player */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <div className="relative backdrop-blur-md bg-surface/30 rounded-xl border border-neon-cyan/10 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5 opacity-50" />
                <BeatPlayer 
                  isPlaying={isPlaying}
                  onBpmChange={setCurrentBpm}
                />
              </div>
            </div>

            {/* Word Generator */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <div className="relative backdrop-blur-md bg-surface/30 rounded-xl border border-neon-cyan/10 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5 opacity-50" />
                <AdvancedWordGenerator 
                  isPlaying={isPlaying}
                  onPlayingChange={handlePlayStateChange}
                  bpm={currentBpm}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 container mx-auto px-4 py-6 mt-8">
          <div className="max-w-4xl mx-auto text-center text-text-secondary text-sm">
            <p className="mb-2">
              <span className="text-neon-cyan">フリースタイル</span> • Freestyle Lab
            </p>
            <p className="opacity-50">
              Created for freestyle rap practice
            </p>
          </div>
        </footer>

        {/* Fixed corner decoration */}
        <div className="fixed bottom-4 right-4 text-neon-cyan opacity-30 pointer-events-none">
          <div className="text-right">
            <div className="text-xs">FL_v1.0</div>
            <div className="text-[10px] font-mono">フリースタイル</div>
          </div>
        </div>

        {/* Glow effects */}
        <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent"></div>
        <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent"></div>
      </div>

      {/* Mouse follow glow effect */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute h-full w-full">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(77, 255, 245, 0.05) 0%, transparent 70%)',
            }}
          />
        </div>
      </div>

      {/* Optional scanlines effect */}
      <div 
        className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 3px)',
          backgroundSize: '100% 3px',
        }}
      ></div>

      {/* Vignette effect */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(15, 15, 23, 0.4) 100%)',
        }}
      ></div>
    </div>
  );
}