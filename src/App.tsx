/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NightSky } from './components/NightSky.tsx';
import { TopNavbar } from './components/TopNavbar.tsx';
import { SheepStage } from './components/SheepStage.tsx';
import { BreathingExercise } from './components/BreathingExercise.tsx';
import { SoundBar } from './components/SoundBar.tsx';
import { BedtimeLetterModal } from './components/BedtimeLetterModal.tsx';
import { ActiveTab } from './types/index.ts';
import { Moon, Sparkles, Wind, Music, Heart, SunMedium } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('counter');
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('sheep_count');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [crushName, setCrushName] = useState<string>(() => {
    return localStorage.getItem('crush_name') || 'Güzelim';
  });
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  // Dimmer level for night mode: 100%, 75%, 50%, 25%
  const [dimmerLevel, setDimmerLevel] = useState<number>(100);

  useEffect(() => {
    localStorage.setItem('sheep_count', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('crush_name', crushName);
  }, [crushName]);

  const handleResetCount = () => {
    setCount(0);
    setAutoPlay(false);
  };

  const cycleDimmer = () => {
    setDimmerLevel((prev) => {
      if (prev === 100) return 75;
      if (prev === 75) return 50;
      if (prev === 50) return 25;
      return 100;
    });
  };

  // Primary Action in navbar
  const handlePrimaryAction = () => {
    if (activeTab === 'counter') {
      setAutoPlay((prev) => !prev);
    } else {
      setActiveTab('counter');
    }
  };

  const primaryActionLabel = activeTab === 'counter'
    ? (autoPlay ? 'Sayımı Durdur' : 'Otomatik Sayım')
    : 'Koyun Sayacına Dön';

  return (
    <div className="relative min-h-screen bg-[#060a17] text-slate-100 flex flex-col selection:bg-indigo-500/30">
      {/* Night Sky with Twinkling Stars */}
      <NightSky />

      {/* Dimmer Overlay for bedtime eye comfort */}
      {dimmerLevel < 100 && (
        <div
          className="fixed inset-0 bg-black pointer-events-none z-40 transition-opacity duration-500"
          style={{ opacity: (100 - dimmerLevel) / 100 * 0.8 }}
        />
      )}

      {/* Top 3-Zone Navigation Header */}
      <TopNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPrimaryAction={handlePrimaryAction}
        primaryActionLabel={primaryActionLabel}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-6 md:py-8 w-full max-w-6xl mx-auto">
        {/* Subtle Bedtime Greeting Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-indigo-300/80 text-xs tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>HUŞU VE TATLI RÜYALAR İÇİN</span>
            <span aria-hidden="true">·</span>
            <span>GECE SAATİ</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-serif-dream font-semibold text-white tracking-tight">
            İyi Uykular, <span className="text-amber-200 italic">{crushName || 'Birtanem'}</span>
          </h1>

          <p className="text-xs md:text-sm text-indigo-200/70 mt-1.5 max-w-xl mx-auto">
            Zihnini boşalt, omuzlarını rahat bırak ve koyunların çitin üzerinden atlayışını izle.
          </p>
        </div>

        {/* Quick Dimmer / Night Light Pill Controller */}
        <div className="flex items-center gap-3 mb-6 bg-indigo-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-indigo-500/20 text-xs text-indigo-300">
          <SunMedium className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ekran Parlaklığı:</span>
          <button
            onClick={cycleDimmer}
            className="font-medium text-amber-200 hover:text-white transition-colors underline cursor-pointer"
          >
            %{dimmerLevel} ({dimmerLevel === 100 ? 'Normal' : dimmerLevel === 75 ? 'Dinlendirici' : dimmerLevel === 50 ? 'Gece Lambası' : 'Ayışığı'})
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'counter' && (
          <div className="w-full flex flex-col items-center">
            <SheepStage
              crushName={crushName}
              count={count}
              onCountChange={setCount}
              onReset={handleResetCount}
              autoPlay={autoPlay}
              onToggleAutoPlay={() => setAutoPlay((prev) => !prev)}
            />

            {/* Quick Bedtime Tips Strip */}
            <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-950/30 border border-indigo-500/15 p-4 rounded-2xl">
                <h3 className="text-sm font-semibold text-indigo-100 flex items-center gap-2 mb-1">
                  <Moon className="w-4 h-4 text-amber-200" />
                  Mavi Işığı Azalt
                </h3>
                <p className="text-xs text-indigo-300/70 leading-relaxed">
                  Gözlerin yorulmasın diye ekran parlaklığını %50 veya daha altına ayarlayabilirsin.
                </p>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-500/15 p-4 rounded-2xl">
                <h3 className="text-sm font-semibold text-indigo-100 flex items-center gap-2 mb-1">
                  <Wind className="w-4 h-4 text-teal-200" />
                  4-7-8 Nefes Döngüsü
                </h3>
                <p className="text-xs text-indigo-300/70 leading-relaxed">
                  Uykuya dalmakta zorlandığında 'Nefes Egzersizi' sekmesindeki ritmik döngüyü deneyebilirsin.
                </p>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-500/15 p-4 rounded-2xl">
                <h3 className="text-sm font-semibold text-indigo-100 flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-rose-300" />
                  Tatlı İyi Geceler Notu
                </h3>
                <p className="text-xs text-indigo-300/70 leading-relaxed">
                  Ona özel hissettirmek için 'İyi Geceler Notu' bölümündeki samimi mektubu gönderebilirsin.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'breathing' && (
          <BreathingExercise />
        )}

        {activeTab === 'sounds' && (
          <SoundBar />
        )}

        {activeTab === 'letter' && (
          <BedtimeLetterModal
            crushName={crushName}
            onUpdateCrushName={setCrushName}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar for touch devices */}
      <div className="md:hidden sticky bottom-0 inset-x-0 bg-[#060a17]/95 backdrop-blur-md border-t border-indigo-950/80 px-4 py-2 z-50 flex items-center justify-around text-xs">
        <button
          onClick={() => setActiveTab('counter')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${activeTab === 'counter' ? 'text-amber-200 font-semibold' : 'text-indigo-400'}`}
        >
          <Moon className="w-4 h-4" />
          <span>Koyunlar</span>
        </button>

        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${activeTab === 'breathing' ? 'text-amber-200 font-semibold' : 'text-indigo-400'}`}
        >
          <Wind className="w-4 h-4" />
          <span>Nefes</span>
        </button>

        <button
          onClick={() => setActiveTab('sounds')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${activeTab === 'sounds' ? 'text-amber-200 font-semibold' : 'text-indigo-400'}`}
        >
          <Music className="w-4 h-4" />
          <span>Sesler</span>
        </button>

        <button
          onClick={() => setActiveTab('letter')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${activeTab === 'letter' ? 'text-amber-200 font-semibold' : 'text-indigo-400'}`}
        >
          <Heart className="w-4 h-4" />
          <span>Not</span>
        </button>
      </div>

      {/* Minimalistic Quiet Footer */}
      <footer className="relative z-10 w-full py-4 text-center border-t border-indigo-950/40 text-xs text-indigo-400/50">
        <div className="flex items-center justify-center gap-2">
          <span>Tatlı Rüyalar</span>
          <span aria-hidden="true">·</span>
          <span>Mışıl Mışıl Uykular</span>
          <span aria-hidden="true">·</span>
          <span>Huzur Bahçesi</span>
        </div>
      </footer>
    </div>
  );
}
