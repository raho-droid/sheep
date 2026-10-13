import React, { useMemo } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const NightSky: React.FC = () => {
  // Generate stable deterministic star positions
  const stars: Star[] = useMemo(() => {
    const list: Star[] = [];
    for (let i = 0; i < 70; i++) {
      list.push({
        id: i,
        top: Math.random() * 85,
        left: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep night gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060914] via-[#0d1226] to-[#141b38]" />

      {/* Soft celestial nebulae */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[350px] h-[350px] bg-blue-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white shadow-xs"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `star-twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 2 ? '0 0 6px rgba(255, 255, 255, 0.8)' : undefined,
          }}
        />
      ))}

      {/* Gentle Shooting Star */}
      <div 
        className="absolute top-[12%] right-[25%] w-[80px] h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[-30deg] opacity-0 animate-pulse"
        style={{ animationDuration: '7s' }}
      />
    </div>
  );
};
