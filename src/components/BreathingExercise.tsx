import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Heart } from 'lucide-react';

export const BreathingExercise: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // Stages: 'inhale' (4s), 'hold' (7s), 'exhale' (8s)
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) {
      setPhase('idle');
      return;
    }

    // Initial phase
    if (phase === 'idle') {
      setPhase('inhale');
      setSecondsLeft(4);
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition between phases
        if (phase === 'inhale') {
          setPhase('hold');
          return 7;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 8;
        } else {
          // Finished exhale, cycle completed
          setCompletedCycles((c) => c + 1);
          setPhase('inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
    if (!isRunning && phase === 'idle') {
      setPhase('inhale');
      setSecondsLeft(4);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('idle');
    setSecondsLeft(4);
    setCompletedCycles(0);
  };

  // Compute animation scaling based on current phase
  let circleScale = 'scale-100';
  let instruction = 'Başlamak için butona dokun';
  let subInstruction = '4-7-8 tekniği kalp atışını yavaşlatır ve uykuya geçişi hızlandırır';
  let ringColor = 'border-indigo-500/30 text-indigo-300';

  if (phase === 'inhale') {
    circleScale = 'scale-125 transition-transform duration-[4000ms] ease-out';
    instruction = 'Derin Nefes Al';
    subInstruction = 'Burnundan yavaşça ve sakince doldur ciğerlerini...';
    ringColor = 'border-teal-400/60 text-teal-200';
  } else if (phase === 'hold') {
    circleScale = 'scale-125';
    instruction = 'Nefesini Tut';
    subInstruction = 'Rahatla, tüm kasların gevşesin...';
    ringColor = 'border-amber-400/60 text-amber-200';
  } else if (phase === 'exhale') {
    circleScale = 'scale-90 transition-transform duration-[8000ms] ease-in-out';
    instruction = 'Yavaşça Ağzından Ver';
    subInstruction = 'Günün bütün ağırlığını nefesinle dışarı bırak...';
    ringColor = 'border-indigo-400/60 text-indigo-200';
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 flex flex-col items-center text-center">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-serif-dream text-indigo-100">
          4-7-8 Uyku Nefesi
        </h2>
        <p className="text-xs md:text-sm text-indigo-300/70 mt-1 max-w-md mx-auto">
          Zihnini sakinleştirmek ve kalp ritmini uyku temposuna çekmek için en doğal yöntem.
        </p>
      </div>

      {/* Breathing Animated Visualizer */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 my-4 flex items-center justify-center">
        {/* Soft background pulse glows */}
        <div className={`absolute inset-4 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-1000 ${isRunning ? 'opacity-80' : 'opacity-30'}`} />

        {/* Outer Ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-dashed ${ringColor} transition-colors duration-700 ${isRunning ? 'animate-spin' : ''}`}
          style={{ animationDuration: '30s' }}
        />

        {/* Expanding / Contracting Breathing Sphere */}
        <div
          className={`w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-indigo-950 via-indigo-900/60 to-purple-950/80 border border-indigo-400/30 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md ${circleScale}`}
        >
          <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">
            {isRunning ? secondsLeft : '4-7-8'}
          </span>
          <span className="text-xs md:text-sm font-medium mt-1 text-indigo-200">
            {instruction}
          </span>
        </div>
      </div>

      {/* Subtext info */}
      <p className="text-xs md:text-sm text-indigo-300/80 mt-2 min-h-[24px] max-w-sm">
        {subInstruction}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={toggleRunning}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-950 transition-all"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Durdur</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Nefes Egzersizini Başlat</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/20 text-indigo-300 transition-colors"
          title="Sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Cycle counter */}
      {completedCycles > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-indigo-400/80 mt-4">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>Tamamlanan Döngü: <strong className="text-indigo-200 tabular-nums">{completedCycles}</strong></span>
        </div>
      )}
    </div>
  );
};
