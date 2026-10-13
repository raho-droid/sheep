import React from 'react';
import { ActiveTab } from '../types/index.ts';

interface TopNavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onTabChange,
  onPrimaryAction,
  primaryActionLabel,
}) => {
  return (
    <header className="w-full flex items-center justify-between gap-8 px-6 py-4 border-b border-indigo-950/80 bg-[#060a17]/80 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onTabChange('counter')}
        className="text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-serif-dream hover:text-indigo-200 transition-colors cursor-pointer text-left"
      >
        RüyaBahçesi
      </button>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-indigo-300/80">
        <button
          onClick={() => onTabChange('counter')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'counter'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : ''
          }`}
        >
          Koyun Sayacı
        </button>

        <button
          onClick={() => onTabChange('breathing')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'breathing'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : ''
          }`}
        >
          Nefes Egzersizi
        </button>

        <button
          onClick={() => onTabChange('sounds')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'sounds'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : ''
          }`}
        >
          Uyku Sesleri
        </button>

        <button
          onClick={() => onTabChange('letter')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'letter'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : ''
          }`}
        >
          İyi Geceler Notu
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onPrimaryAction}
          className="px-4 py-2 text-xs md:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-950 whitespace-nowrap shrink-0 active:scale-95"
        >
          {primaryActionLabel}
        </button>
      </div>
    </header>
  );
};
