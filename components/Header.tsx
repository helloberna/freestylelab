// components/Header.tsx
export default function Header() {
  return (
    <header className="relative overflow-hidden py-12 mb-8">
      {/* Japanese pattern background */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4">
          {/* Japanese & English title */}
          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="block text-2xl text-neon-cyan mb-2 font-normal">
              フリースタイル ラボ
            </span>
            <span className="bg-gradient-to-r from-neon-red via-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Freestyle Lab
            </span>
          </h1>

          <p className="text-text-secondary text-lg">
            <span className="text-neon-cyan">バース</span> by バース • Beat by Beat
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple opacity-10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan opacity-10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>
    </header>
  );
}