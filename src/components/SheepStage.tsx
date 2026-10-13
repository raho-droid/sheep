import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedSheepSvg } from './AnimatedSheepSvg.tsx';
import { soundEngine } from '../utils/soundEngine.ts';
import { Play, Pause, Sparkles, RotateCcw, Volume2, VolumeX, Moon } from 'lucide-react';

interface SheepStageProps {
  crushName: string;
  count: number;
  onCountChange: (newCount: number) => void;
  onReset: () => void;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
}

interface ActiveSheep {
  id: string;
  number: number;
  accessory: 'nightcap' | 'flower' | 'crown' | 'stars' | 'ribbon';
  progress: number; // 0 to 1
  startTime: number;
  duration: number; // in ms
}

const MILESTONES: Record<number, { text: string; subtext: string }> = {
  1: {
    text: "Günün tüm koşuşturmacasını yavaşça arkanda bırak...",
    subtext: "Şimdi sadece sen, sakin bir gece ve tatlı koyunlar var."
  },
  3: {
    text: "Omuzlarını biraz düşür, derin ve huzurlu bir nefes al.",
    subtext: "Yastığın ne kadar yumuşak, hissetmeye başla."
  },
  5: {
    text: "Bugün elinden gelenin en iyisini yaptın ve harikaydın.",
    subtext: "Artık zihninin de dinlenme vakti geldi."
  },
  10: {
    text: "Göz kapakların ağırlaşmaya başladı mı?",
    subtext: "Kendini tatlı uykunun kollarına bırakabilirsin..."
  },
  15: {
    text: "Bu gece rüyalarında yıldızlar senin için parlıyor.",
    subtext: "Yıldızların altında huzur dolu bir yolculuktasın."
  },
  20: {
    text: "Umarım rüyanda çok mutlu olacağın bir yerde olursun.",
    subtext: "Belki de birlikte rüyalarda karşılaşırız..."
  },
  30: {
    text: "Nefesin sakinleşti, kalp atışların dinginleşti.",
    subtext: "Yavaşça kaybol uyku bulutlarının arasında..."
  },
  50: {
    text: "Seni düşünen ve sana iyi uykular dileyen biri var.",
    subtext: "Huzurla uyu, tatlı rüyalar..."
  },
  100: {
    text: "Hâlâ uyuyamadıysan bile sorun değil, buradayım.",
    subtext: "Sadece gözlerini dinlendir, hiçbir şey düşünme."
  }
};

const ACCESSORIES: Array<'nightcap' | 'flower' | 'crown' | 'stars' | 'ribbon'> = [
  'nightcap', 'flower', 'crown', 'stars', 'ribbon'
];

export const SheepStage: React.FC<SheepStageProps> = ({
  crushName,
  count,
  onCountChange,
  onReset,
  autoPlay,
  onToggleAutoPlay,
}) => {
  const [activeSheepList, setActiveSheepList] = useState<ActiveSheep[]>([]);
  const [currentMilestone, setCurrentMilestone] = useState<{ text: string; subtext: string } | null>(null);
  const [dustPuffs, setDustPuffs] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(soundEngine.getMuted());
  const [speed, setSpeed] = useState<number>(3.5); // seconds per sheep in autoplay

  const stageRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const autoPlayIntervalRef = useRef<any>(null);
  const lastJumpTimeRef = useRef<number>(0);

  // Jump a new sheep
  const triggerJump = useCallback(() => {
    const nextCount = count + 1;
    onCountChange(nextCount);

    const randomAccessory = ACCESSORIES[nextCount % ACCESSORIES.length];
    const newSheep: ActiveSheep = {
      id: `sheep-${Date.now()}-${Math.random()}`,
      number: nextCount,
      accessory: randomAccessory,
      progress: 0,
      startTime: performance.now(),
      duration: 2200, // 2.2 seconds jump arc
    };

    setActiveSheepList((prev) => [...prev, newSheep]);

    // Play chime sound
    soundEngine.playSheepJump(nextCount);

    // Milestone trigger
    if (MILESTONES[nextCount]) {
      setCurrentMilestone(MILESTONES[nextCount]);
      soundEngine.playMilestoneSound();
    }
  }, [count, onCountChange]);

  // Handle Autoplay timer
  useEffect(() => {
    if (autoPlay) {
      // Trigger one immediately if none jumped recently
      const now = Date.now();
      if (now - lastJumpTimeRef.current > speed * 1000) {
        triggerJump();
        lastJumpTimeRef.current = now;
      }

      autoPlayIntervalRef.current = setInterval(() => {
        triggerJump();
        lastJumpTimeRef.current = Date.now();
      }, speed * 1000);
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [autoPlay, speed, triggerJump]);

  // Keyboard shortcut: Spacebar jumps a sheep
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerJump]);

  // Animation Loop for physics/parabolic motion
  useEffect(() => {
    const updatePhysics = (now: number) => {
      setActiveSheepList((prevList) => {
        const remaining: ActiveSheep[] = [];

        prevList.forEach((sheep) => {
          const elapsed = now - sheep.startTime;
          const progress = Math.min(1, elapsed / sheep.duration);

          // If reached landing point (~85% progress), trigger landing dust puff once
          if (progress >= 0.85 && sheep.progress < 0.85) {
            setDustPuffs((dusts) => [
              ...dusts.slice(-6),
              { id: `dust-${Date.now()}-${Math.random()}`, x: 82, y: 76 }
            ]);
          }

          if (progress < 1) {
            remaining.push({
              ...sheep,
              progress,
            });
          }
        });

        return remaining;
      });

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Clean dust puffs
  useEffect(() => {
    if (dustPuffs.length > 0) {
      const timer = setTimeout(() => {
        setDustPuffs((prev) => prev.slice(1));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [dustPuffs]);

  const toggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* Bedtime Whisper Milestone Message */}
      <div className="w-full min-h-[58px] mb-3 flex items-center justify-center px-4">
        {currentMilestone ? (
          <div className="text-center transition-all duration-700 animate-fadeIn bg-indigo-950/40 backdrop-blur-md border border-indigo-500/20 px-6 py-2.5 rounded-2xl shadow-lg max-w-2xl">
            <p className="text-indigo-200 text-sm md:text-base font-medium font-serif-dream italic">
              "{currentMilestone.text}"
            </p>
            <p className="text-indigo-300/80 text-xs mt-0.5">
              {crushName ? `${crushName}, ` : ''}{currentMilestone.subtext}
            </p>
          </div>
        ) : (
          <div className="text-center text-xs md:text-sm text-indigo-300/70 tracking-wide">
            {crushName ? `${crushName} için ` : ''}Tatlı bir uyku için ekrana veya butona dokun, koyunlar çitin üzerinden atlasın 🌙
          </div>
        )}
      </div>

      {/* Main Stage Canvas Container */}
      <div
        ref={stageRef}
        onClick={(e) => {
          // Prevent click if clicking direct buttons
          if ((e.target as HTMLElement).closest('button')) return;
          triggerJump();
        }}
        className="relative w-full aspect-[16/9] min-h-[360px] max-h-[520px] rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl cursor-pointer select-none bg-slate-950 group"
      >
        {/* Background Meadow Art Image */}
        <img
          src="/src/assets/images/dreamy_night_meadow_1791928754040.jpg"
          alt="Dreamy Sleep Meadow"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-1000 group-hover:scale-[1.01]"
        />

        {/* Soft Dream Scrim Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-transparent to-[#070b18]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-indigo-950/20 pointer-events-none" />

        {/* Floating Moonlight Glow */}
        <div className="absolute top-6 left-10 flex items-center gap-3 bg-indigo-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-indigo-400/25 text-indigo-200 text-xs pointer-events-none">
          <Moon className="w-3.5 h-3.5 text-amber-200 fill-amber-200/40" />
          <span>Uyku Sayacı: <strong className="text-amber-200 text-sm font-semibold tabular-nums">{count}</strong> koyun</span>
        </div>

        {/* Tap Prompt Hint (fades out as count grows) */}
        {count === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none animate-pulse">
            <div className="px-5 py-2.5 rounded-2xl bg-indigo-950/80 backdrop-blur-md border border-indigo-400/40 text-indigo-100 text-sm font-medium shadow-xl">
              ✨ Koyun zıplatmak için buraya dokun veya boşluk (Space) tuşuna bas
            </div>
          </div>
        )}

        {/* Foreground Rustic Wooden Fence */}
        <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 z-10 flex items-end pointer-events-none">
          <div className="relative w-28 md:w-36 h-24 flex items-end justify-center">
            {/* Wooden Fence Posts */}
            <svg viewBox="0 0 140 100" fill="none" className="w-full h-full drop-shadow-lg">
              {/* Horizontal rails */}
              <rect x="5" y="45" width="130" height="9" rx="2" fill="#78350F" opacity="0.9" />
              <rect x="5" y="70" width="130" height="9" rx="2" fill="#78350F" opacity="0.9" />
              {/* Vertical pickets */}
              <path d="M 20 20 L 30 10 L 40 20 L 40 95 L 20 95 Z" fill="#92400E" />
              <path d="M 60 16 L 70 6 L 80 16 L 80 95 L 60 95 Z" fill="#B45309" />
              <path d="M 100 20 L 110 10 L 120 20 L 120 95 L 100 95 Z" fill="#92400E" />
              {/* Wood texture lines */}
              <line x1="70" y1="20" x2="70" y2="90" stroke="#78350F" strokeWidth="1" opacity="0.5" />
              <line x1="30" y1="25" x2="30" y2="90" stroke="#78350F" strokeWidth="1" opacity="0.5" />
              <line x1="110" y1="25" x2="110" y2="90" stroke="#78350F" strokeWidth="1" opacity="0.5" />
            </svg>

            {/* Little firefly on the fence */}
            <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] animate-ping" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Foreground Wildflowers & Dream Grass */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#060a17] to-transparent pointer-events-none z-10 flex items-end justify-between px-6">
          <div className="text-[11px] text-indigo-300/40 pb-2">
            Huzurlu gece çayırı
          </div>
          <div className="text-[11px] text-indigo-300/40 pb-2 font-mono tabular-nums">
            {count > 0 ? `Tatlı Rüyalar (${count})` : "Sessiz Gece"}
          </div>
        </div>

        {/* Active Jumping Sheep in Flight */}
        {activeSheepList.map((sheep) => {
          // Trajectory: Start at X: 5%, End at X: 92%
          // Y arc: starts at 68%, peaks at ~25% (over fence at progress 0.5), lands at 68%
          const p = sheep.progress;
          const x = 5 + p * 87; // from left to right

          // Parabolic jump arc: y = base - 4 * peakHeight * p * (1 - p)
          // At p=0: 68%, at p=0.5: 68 - 45 = 23%, at p=1: 68%
          const jumpHeight = 44; 
          const y = 66 - 4 * jumpHeight * p * (1 - p);

          // Gentle rotation during jump: tilts back slightly on take off, levels, tilts forward on landing
          const rotation = (p - 0.45) * 35;

          return (
            <div
              key={sheep.id}
              className="absolute pointer-events-none z-20"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                transition: 'none',
              }}
            >
              <AnimatedSheepSvg
                number={sheep.number}
                accessory={sheep.accessory}
                isJumping={true}
                className="w-24 h-24 md:w-32 md:h-32"
              />
            </div>
          );
        })}

        {/* Dust & Cloud Landing Puffs */}
        {dustPuffs.map((dust) => (
          <div
            key={dust.id}
            className="absolute pointer-events-none z-10 flex items-center justify-center animate-ping"
            style={{
              left: `${dust.x}%`,
              top: `${dust.y}%`,
              transform: 'translate(-50%, -50%)',
              animationDuration: '0.6s',
            }}
          >
            <div className="w-8 h-4 rounded-full bg-indigo-200/30 blur-xs" />
          </div>
        ))}
      </div>

      {/* Control Strip & Interactive Buttons */}
      <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
        {/* Left Action: Main Jump Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerJump}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 text-white font-medium text-sm md:text-base shadow-lg shadow-indigo-900/40 border border-indigo-400/30 flex items-center gap-2.5 transition-all whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Koyun Zıplat (+1)</span>
          </button>

          {/* Autoplay Toggle */}
          <button
            onClick={onToggleAutoPlay}
            className={`px-4 py-3 rounded-2xl text-xs md:text-sm font-medium border transition-all flex items-center gap-2 whitespace-nowrap ${
              autoPlay
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                : 'bg-indigo-950/40 hover:bg-indigo-900/50 border-indigo-500/20 text-indigo-300'
            }`}
            title="Otomatik modda telefonunuzu bırakıp koyunların kendi kendine atlamasını izleyebilirsiniz"
          >
            {autoPlay ? (
              <>
                <Pause className="w-4 h-4 text-amber-300" />
                <span>Otomatik Sayım Açık</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-indigo-300" />
                <span>Otomatik Sayım</span>
              </>
            )}
          </button>
        </div>

        {/* Right Action: Settings, Speed & Sound Mute */}
        <div className="flex items-center gap-2">
          {/* Autoplay Speed selector if autoplay is on */}
          {autoPlay && (
            <div className="flex items-center gap-1 bg-indigo-950/60 border border-indigo-500/20 px-2.5 py-1.5 rounded-xl text-xs text-indigo-300">
              <span className="text-indigo-400">Hız:</span>
              <button
                onClick={() => setSpeed(5)}
                className={`px-2 py-0.5 rounded-md ${speed === 5 ? 'bg-indigo-600 text-white font-semibold' : 'hover:text-white'}`}
              >
                Rüya (5s)
              </button>
              <button
                onClick={() => setSpeed(3.5)}
                className={`px-2 py-0.5 rounded-md ${speed === 3.5 ? 'bg-indigo-600 text-white font-semibold' : 'hover:text-white'}`}
              >
                Sakin (3.5s)
              </button>
              <button
                onClick={() => setSpeed(2.5)}
                className={`px-2 py-0.5 rounded-md ${speed === 2.5 ? 'bg-indigo-600 text-white font-semibold' : 'hover:text-white'}`}
              >
                Seri (2.5s)
              </button>
            </div>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-3 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/20 text-indigo-300 transition-colors"
            title={isAudioMuted ? "Sesi Aç" : "Sesi Kapat"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-indigo-200" />}
          </button>

          {/* Reset Counter */}
          {count > 0 && (
            <button
              onClick={onReset}
              className="p-3 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/20 text-indigo-400 hover:text-indigo-200 transition-colors"
              title="Sayacı Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
