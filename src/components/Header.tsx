import React from 'react';
import { Edit2, Shield, Zap } from 'lucide-react';

interface HeaderProps {
  userName: string;
  shieldActive: boolean;
  xp: number;
  onEditName: () => void;
  onToggleShield: () => void;
  onOpenOnboarding: () => void;
  onOpenAndroidBridge: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  shieldActive,
  xp,
  onEditName,
  onToggleShield,
  onOpenOnboarding,
  onOpenAndroidBridge,
}) => {
  const level = Math.floor(xp / 100) + 1;

  return (
    <header className="p-6 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 gap-4 bg-[#0A0A0A] shrink-0">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-xs tracking-[0.3em] font-medium text-neutral-500 uppercase">
            LifeOS AI — v1.0.4
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-400 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-400" /> Lvl {level} ({xp} XP)
          </span>
        </div>
        <div className="text-2xl mt-2 font-light flex items-center gap-2 group">
          <span>Good Morning,</span>
          <span className="font-medium text-white">{userName}</span>
          <button
            onClick={onEditName}
            className="text-neutral-600 hover:text-neutral-300 transition-colors p-1 cursor-pointer"
            title="Change name"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onOpenOnboarding}
          className="px-3 py-1.5 rounded bg-neutral-900 border border-white/10 hover:border-white/30 text-[11px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          ⚙️ Personalize OS
        </button>

        <button
          onClick={onOpenAndroidBridge}
          className="px-3 py-1.5 rounded bg-neutral-900 border border-emerald-500/30 hover:border-emerald-500/60 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          📱 Android Bridge
        </button>

        <button
          onClick={onToggleShield}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-neutral-900/80 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              shieldActive
                ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse'
                : 'bg-red-500'
            }`}
          />
          <span
            className={`text-xs font-mono tracking-tighter uppercase font-medium ${
              shieldActive ? 'text-emerald-500' : 'text-red-400'
            }`}
          >
            {shieldActive ? 'Shield Active' : 'Shield Offline'}
          </span>
          <Shield className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors ml-1" />
        </button>
      </div>
    </header>
  );
};
