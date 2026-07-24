import React, { useState, useEffect } from 'react';
import { Task, BlockedTarget } from '../types/lifeos';
import { focusAudioSynth } from '../utils/audioSynth';
import { Volume2, VolumeX, Shield, Lock, Unlock, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';

interface FocusModeViewProps {
  tasks: Task[];
  blockedTargets: BlockedTarget[];
  onOpenEmergencyUnlock: (targetName: string) => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  tasks,
  blockedTargets,
  onOpenEmergencyUnlock,
}) => {
  const [activeTask, setActiveTask] = useState<Task>(tasks[0] || {
    id: 'f-task',
    title: 'Study Measure Theory',
    priority: 'high',
    deadline: 'Today',
    category: 'Academics',
    completed: false
  });

  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [dopamineLock, setDopamineLock] = useState(false);
  const [soundType, setSoundType] = useState<'brown' | 'white' | 'rain'>('brown');
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (mins: number) => {
    setIsRunning(false);
    setTimerSeconds(mins * 60);
  };

  const toggleSound = () => {
    if (soundPlaying) {
      focusAudioSynth.stop();
      setSoundPlaying(false);
    } else {
      focusAudioSynth.start(soundType, volume);
      setSoundPlaying(true);
    }
  };

  const handleSoundTypeChange = (type: 'brown' | 'white' | 'rain') => {
    setSoundType(type);
    if (soundPlaying) {
      focusAudioSynth.start(type, volume);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    focusAudioSynth.setVolume(v);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex-1 p-6 md:p-12 overflow-y-auto flex flex-col justify-between transition-colors duration-500 ${dopamineLock ? 'bg-black text-neutral-300 select-none' : 'bg-[#0A0A0A] text-white'}`}>
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Header Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-xs tracking-[0.4em] text-neutral-500 uppercase font-medium">
              Deep Focus & Dopamine Shield
            </h2>
            <p className="text-2xl font-light mt-1">
              {dopamineLock ? 'Dopamine Lock Engaged (Monochrome)' : 'Zero Distractions. Total Executive Control.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDopamineLock(!dopamineLock)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                dopamineLock
                  ? 'bg-neutral-800 text-white border border-white/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {dopamineLock ? 'Exit Dopamine Lock' : 'Enable Dopamine Lock'}
            </button>
          </div>
        </div>

        {/* Task Selector & Big Timer */}
        <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-8 text-center space-y-8">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              Current Focus Mission
            </span>
            <select
              value={activeTask.id}
              onChange={(e) => {
                const found = tasks.find((t) => t.id === e.target.value);
                if (found) setActiveTask(found);
              }}
              className="mt-2 block w-full max-w-md mx-auto bg-neutral-950 border border-white/10 rounded-lg px-4 py-2.5 text-base text-white font-medium focus:outline-none focus:border-white/30 text-center"
            >
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.priority.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Clock Display */}
          <div className="py-4">
            <div className="text-6xl md:text-8xl font-light font-mono tracking-tighter text-white">
              {formatTime(timerSeconds)}
            </div>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-2">
              {isRunning ? 'Timer Running' : 'Timer Paused'}
            </p>
          </div>

          {/* Timer Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 cursor-pointer shadow-xl ${
                isRunning
                  ? 'bg-neutral-800 text-white border border-white/20 hover:bg-neutral-700'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
              {isRunning ? 'Pause Session' : 'Start Focus'}
            </button>

            <div className="flex items-center gap-2 bg-neutral-950 border border-white/10 p-1.5 rounded-full">
              <button
                onClick={() => resetTimer(25)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase cursor-pointer ${
                  timerSeconds === 25 * 60 ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                25m
              </button>
              <button
                onClick={() => resetTimer(45)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase cursor-pointer ${
                  timerSeconds === 45 * 60 ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                45m
              </button>
              <button
                onClick={() => resetTimer(60)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase cursor-pointer ${
                  timerSeconds === 60 * 60 ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                60m
              </button>
            </div>
          </div>
        </div>

        {/* Focus Soundscape & Active Distraction Shields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio Synthesizer */}
          <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-neutral-300" />
                Focus Soundscape (Web Synth)
              </span>
              <button
                onClick={toggleSound}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  soundPlaying ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {soundPlaying ? 'Sound Active' : 'Off'}
              </button>
            </div>

            <div className="flex gap-2">
              {(['brown', 'rain', 'white'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleSoundTypeChange(st)}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase border transition-all cursor-pointer ${
                    soundType === st
                      ? 'bg-white/10 border-white text-white font-bold'
                      : 'border-white/5 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {st} noise
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-white h-1 bg-neutral-800 rounded"
              />
              <Volume2 className="w-3.5 h-3.5 text-neutral-300" />
            </div>
          </div>

          {/* Blocked Apps & Emergency Unlock */}
          <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                Blocked Distractions
              </span>
              <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40 uppercase">
                Active Block
              </span>
            </div>

            <div className="space-y-2">
              {blockedTargets.map((item) => (
                <div
                  key={item.id}
                  className="bg-black/60 border border-white/5 p-3 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-medium text-white">{item.name}</span>
                  </div>

                  <button
                    onClick={() => onOpenEmergencyUnlock(item.name)}
                    className="text-[10px] font-mono text-neutral-400 hover:text-amber-400 border border-white/10 hover:border-amber-500/40 px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Unlock className="w-2.5 h-2.5" /> Request Pass
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
