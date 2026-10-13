import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine.ts';
import { AmbientSoundType } from '../types/index.ts';
import { Music, CloudRain, Wind, Waves, Volume2, VolumeX, Clock, Check } from 'lucide-react';

export const SoundBar: React.FC = () => {
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(40);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState<number | null>(null);

  // Soundscape presets
  const SOUND_OPTIONS: Array<{
    id: AmbientSoundType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'lullaby',
      label: 'Ninni Melodisi',
      description: 'Hafif müzik kutusu tınıları',
      icon: Music,
    },
    {
      id: 'rain',
      label: 'Ilık Gece Yağmuru',
      description: 'Pencereye vuran sakin yağmur',
      icon: CloudRain,
    },
    {
      id: 'crickets',
      label: 'Yaz Rüzgarı & Gece',
      description: 'Sessiz çayır ve cırcır böcekleri',
      icon: Wind,
    },
    {
      id: 'waves',
      label: 'Dingin Dalgalar',
      description: 'Yumuşak deniz kıyısı ritmi',
      icon: Waves,
    },
  ];

  const handleSelectSound = (type: AmbientSoundType) => {
    if (activeSound === type) {
      soundEngine.playAmbient('none');
      setActiveSound('none');
    } else {
      soundEngine.playAmbient(type);
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setAmbientVolume(newVal);
    soundEngine.setAmbientVolume(newVal / 100);
  };

  // Sleep Timer logic
  useEffect(() => {
    if (!sleepTimerMinutes) {
      setTimerRemainingSeconds(null);
      return;
    }

    setTimerRemainingSeconds(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setTimerRemainingSeconds((prev) => {
        if (!prev || prev <= 1) {
          // Timer finished! Stop sounds
          soundEngine.playAmbient('none');
          setActiveSound('none');
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes]);

  const formatRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-serif-dream text-indigo-100">
          Rahatlatıcı Uyku Sesleri
        </h2>
        <p className="text-xs md:text-sm text-indigo-300/70 mt-1">
          Kafandaki düşünceleri susturmak için arka planda fısıldayan doğal sesler.
        </p>
      </div>

      {/* Grid of Soundscapes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        {SOUND_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isSelected = activeSound === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectSound(item.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'bg-indigo-900/40 border-indigo-400/50 shadow-lg shadow-indigo-950/50'
                  : 'bg-indigo-950/30 hover:bg-indigo-900/20 border-indigo-500/15'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-950/60 text-indigo-400 group-hover:text-indigo-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                    <Check className="w-3.5 h-3.5" />
                    Çalıyor
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  {item.label}
                </h3>
                <p className="text-xs text-indigo-300/60 mt-0.5">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Volume & Sleep Timer Bar */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4">
        {/* Ambient Volume */}
        <div className="flex items-center gap-3 min-w-[200px]">
          {ambientVolume === 0 ? (
            <VolumeX className="w-4 h-4 text-indigo-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-indigo-300" />
          )}
          <input
            type="range"
            min="0"
            max="100"
            value={ambientVolume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-32 h-1.5 bg-indigo-900/80 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
          <span className="text-xs text-indigo-300 tabular-nums">%{ambientVolume}</span>
        </div>

        {/* Sleep Timer Selector */}
        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-indigo-300/80">Kapanma Zamanlayıcısı:</span>
          <div className="flex items-center gap-1">
            {[15, 30, 45].map((mins) => (
              <button
                key={mins}
                onClick={() => setSleepTimerMinutes(sleepTimerMinutes === mins ? null : mins)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  sleepTimerMinutes === mins
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50'
                }`}
              >
                {mins} dk
              </button>
            ))}
          </div>

          {timerRemainingSeconds !== null && (
            <span className="ml-2 font-mono text-amber-300 tabular-nums bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/30">
              {formatRemaining(timerRemainingSeconds)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
