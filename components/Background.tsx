// components/Background.tsx
export default function Background() {
  return (
    <>
      {/* Base grid */}
      <div className="fixed inset-0 cyber-grid transform-gpu perspective-1000 z-0" />

      {/* Samurai image */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="samurai_PNG6.png"  // Direct path to the image in public folder
            alt=""
            className="w-[800px] h-auto max-w-none object-contain opacity-15 mix-blend-luminosity select-none"
            style={{
              filter: 'hue-rotate(140deg) saturate(50%) brightness(0.8)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
            }}
          />
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/50 to-background opacity-80 z-[2]" />
      <div className="fixed inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-50 z-[2]" />

      {/* Animated orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[3]">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-purple opacity-20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-cyan opacity-20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>
    </>
  );
}