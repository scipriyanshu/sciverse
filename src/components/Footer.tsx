import React from 'react';
import { ActiveTab } from '../types/lifeos';
import { Sparkles, Play } from 'lucide-react';

interface FooterProps {
  activeTab: ActiveTab;
  setTab: (tab: ActiveTab) => void;
  onEnterStudyMode: () => void;
  onOpenPlanner: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  setTab,
  onEnterStudyMode,
  onOpenPlanner,
}) => {
  return (
    <footer className="p-4 md:p-6 bg-[#0E0E0E] border-t border-white/10 flex flex-col sm:flex-row justify-between items-center px-6 md:px-10 gap-4 shrink-0">
      <div className="flex flex-wrap gap-6 md:gap-8 justify-center sm:justify-start">
        <button
          onClick={() => setTab('dashboard')}
          className={`text-[10px] tracking-widest uppercase transition-colors py-1 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-white border-b border-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setTab('braindump')}
          className={`text-[10px] tracking-widest uppercase transition-colors py-1 cursor-pointer ${
            activeTab === 'braindump'
              ? 'text-white border-b border-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
        >
          Brain Dump
        </button>
        <button
          onClick={() => setTab('focus')}
          className={`text-[10px] tracking-widest uppercase transition-colors py-1 cursor-pointer ${
            activeTab === 'focus'
              ? 'text-white border-b border-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
        >
          Focus Mode
        </button>
        <button
          onClick={() => setTab('habits')}
          className={`text-[10px] tracking-widest uppercase transition-colors py-1 cursor-pointer ${
            activeTab === 'habits'
              ? 'text-white border-b border-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
        >
          Habits & Journal
        </button>
        <button
          onClick={() => setTab('vault')}
          className={`text-[10px] tracking-widest uppercase transition-colors py-1 cursor-pointer ${
            activeTab === 'vault'
              ? 'text-white border-b border-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
        >
          Vault & AI
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenPlanner}
          className="text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 rounded-full border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          AI Planner (Top 3)
        </button>
        <button
          onClick={onEnterStudyMode}
          className="bg-white text-black px-6 md:px-8 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer flex items-center gap-2"
        >
          <Play className="w-3 h-3 fill-black" />
          Enter Study Mode
        </button>
      </div>
    </footer>
  );
};
