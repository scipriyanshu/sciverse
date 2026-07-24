import React, { useState } from 'react';
import { Sparkles, ArrowRight, Shield, Moon, Clock, UserCheck, Zap, X } from 'lucide-react';

interface OnboardingModalProps {
  userName: string;
  onComplete: (profileData: {
    persona: string;
    distractions: string[];
    hasADHD: boolean;
    sleepTime: string;
    wakeTime: string;
    primaryGoal: string;
  }) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  userName,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [persona, setPersona] = useState<string>('Researcher / Student');
  const [selectedDistractions, setSelectedDistractions] = useState<string[]>([
    'Instagram',
    'YouTube Shorts',
    'Reddit',
  ]);
  const [hasADHD, setHasADHD] = useState<boolean>(true);
  const [sleepTime, setSleepTime] = useState<string>('23:00');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    'Master Measure Theory & complete research paper outlines without distraction'
  );

  const toggleDistraction = (item: string) => {
    setSelectedDistractions((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    onComplete({
      persona,
      distractions: selectedDistractions,
      hasADHD,
      sleepTime,
      wakeTime,
      primaryGoal,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-10 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              LifeOS Calibration — Step {step} of 3
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-6 h-1 rounded-full transition-all ${
                  step >= i ? 'bg-white' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Persona & Primary Goal */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-2xl font-light text-white">
                Welcome, <span className="font-semibold">{userName}</span>. What are you building towards?
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-2">
                LifeOS adapts its AI Coach and task priority engines around your specific identity.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                Primary Identity / Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Researcher / Student',
                  'Software Engineer',
                  'Founder / Builder',
                  'Writer / Creator',
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setPersona(role)}
                    className={`p-3.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                      persona === role
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-neutral-900 border-white/10 text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                Your Biggest Mission / Goal Right Now
              </label>
              <input
                type="text"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                placeholder="e.g. Ace my exam, build my startup, write my thesis..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Distractions & Dopamine Protection */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-2xl font-light text-white">
                What steals your focus most?
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-2">
                Select apps to automatically enforce with Dopamine Shield & Emergency Unlock Judge.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                'Instagram',
                'YouTube Shorts',
                'Reddit & Feeds',
                'Discord & Gaming',
                'X / Twitter',
                'TikTok',
              ].map((item) => {
                const active = selectedDistractions.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDistraction(item)}
                    className={`p-3.5 rounded-xl text-xs font-mono text-left border transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-red-950/60 border-red-500/60 text-red-300 font-bold'
                        : 'bg-neutral-900 border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <span>{item}</span>
                    <Shield className={`w-3.5 h-3.5 ${active ? 'text-red-400' : 'text-neutral-600'}`} />
                  </button>
                );
              })}
            </div>

            <div className="bg-neutral-900/60 border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-white block">ADHD & Executive Function Support</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Enables single-action task view, dopamine lock mode, and proactive AI coaching nudges.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasADHD(!hasADHD)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase font-bold border transition-colors cursor-pointer ${
                  hasADHD ? 'bg-amber-500 text-black border-amber-500' : 'border-white/10 text-neutral-500'
                }`}
              >
                {hasADHD ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sleep & Circadian Rhythm */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-2xl font-light text-white">
                Circadian & Daily Rhythm
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-2">
                Your AI Coach schedules deep work around your natural energy peaks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-900/60 border border-white/10 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" /> Target Sleep Time
                </span>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg p-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div className="bg-neutral-900/60 border border-white/10 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Target Wake Time
                </span>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg p-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-200 font-sans">
                Profile calibrated! LifeOS will prioritize your active mission, block selected distractions, and prompt focus soundscapes during study windows.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="bg-emerald-500 text-black px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-emerald-400 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                Activate My LifeOS <Zap className="w-4 h-4 fill-black" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
