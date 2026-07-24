import React, { useState } from 'react';
import { Habit, JournalEntry } from '../types/lifeos';
import { Check, Plus, Zap, Award, BookOpen, Smile, Meh, Frown, Sparkles, Send } from 'lucide-react';

interface HabitsJournalViewProps {
  habits: Habit[];
  journals: JournalEntry[];
  xp: number;
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (title: string, category: 'morning' | 'evening' | 'weekly', xpReward: number) => void;
  onSaveJournal: (mood: 'good' | 'neutral' | 'bad', rawText: string, aiSummary: string) => void;
}

export const HabitsJournalView: React.FC<HabitsJournalViewProps> = ({
  habits,
  journals,
  xp,
  onToggleHabit,
  onAddHabit,
  onSaveJournal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'habits' | 'journal'>('habits');
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<'morning' | 'evening' | 'weekly'>('morning');

  // Journal State
  const [selectedMood, setSelectedMood] = useState<'good' | 'neutral' | 'bad'>('good');
  const [journalText, setJournalText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const level = Math.floor(xp / 100) + 1;
  const progressInLevel = xp % 100;

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;
    onAddHabit(habitTitle.trim(), habitCategory, 30);
    setHabitTitle('');
    setShowAddHabitModal(false);
  };

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    setIsSummarizing(true);
    let summary = `Logged ${journalText.split(' ').length} words. Great self-reflection on focus and progress.`;

    try {
      const res = await fetch('/api/study-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material: `Daily Journal Reflection (${selectedMood}): ${journalText}` }),
      });
      const data = await res.json();
      if (data.summary) {
        summary = data.summary;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummarizing(false);
      onSaveJournal(selectedMood, journalText, summary);
      setJournalText('');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0A0A0A] flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-xs tracking-[0.4em] text-neutral-500 uppercase font-medium">
              Habit & Journal Architecture
            </h2>
            <p className="text-2xl font-light text-white mt-1">
              Building consistency through XP rewards and AI reflection.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 p-1.5 rounded-full">
            <button
              onClick={() => setActiveSubTab('habits')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                activeSubTab === 'habits' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Habit System
            </button>
            <button
              onClick={() => setActiveSubTab('journal')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                activeSubTab === 'journal' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              AI Journal
            </button>
          </div>
        </div>

        {/* Level XP Widget */}
        <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Award className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-light text-white">Level {level} Focus Agent</span>
                <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {xp} XP
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Next level in {100 - progressInLevel} XP
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-neutral-950 rounded-full h-3 border border-white/10 p-0.5">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressInLevel}%` }}
            />
          </div>
        </div>

        {/* SubTab 1: Habits */}
        {activeSubTab === 'habits' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                Daily & Weekly Routines
              </span>
              <button
                onClick={() => setShowAddHabitModal(true)}
                className="text-xs text-neutral-300 hover:text-white bg-neutral-900 border border-white/10 px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Habit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`bg-neutral-900/40 border p-4 rounded-xl flex items-center justify-between transition-all ${
                    habit.completedToday ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{habit.title}</span>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-white/5">
                        {habit.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
                      <span>🔥 {habit.streak} day streak</span>
                      <span className="text-amber-400">+{habit.xpReward} XP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleHabit(habit.id)}
                    className={`w-7 h-7 rounded border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                      habit.completedToday
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : 'border-white/20 hover:border-white text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SubTab 2: Journal */}
        {activeSubTab === 'journal' && (
          <div className="space-y-8">
            <form onSubmit={handleJournalSubmit} className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                  Nightly Reflection Log
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMood('good')}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      selectedMood === 'good' ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'border-white/5 text-neutral-500'
                    }`}
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMood('neutral')}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      selectedMood === 'neutral' ? 'bg-amber-950 border-amber-500 text-amber-400' : 'border-white/5 text-neutral-500'
                    }`}
                  >
                    <Meh className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMood('bad')}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      selectedMood === 'bad' ? 'bg-red-950 border-red-500 text-red-400' : 'border-white/5 text-neutral-500'
                    }`}
                  >
                    <Frown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="How was your day? What distracted you? What was your biggest focus victory?"
                rows={4}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl p-4 text-sm text-white font-sans focus:outline-none focus:border-white/40 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSummarizing || !journalText.trim()}
                  className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Save & Summarize with AI
                </button>
              </div>
            </form>

            {/* Previous Journal Logs */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                Reflection History ({journals.length})
              </h3>

              {journals.length === 0 ? (
                <p className="text-xs font-mono text-neutral-600 italic">No past journal entries yet.</p>
              ) : (
                journals.map((j) => (
                  <div key={j.id} className="bg-neutral-900/30 border border-white/10 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                      <span>{j.date}</span>
                      <span className="uppercase text-amber-400">Mood: {j.mood}</span>
                    </div>
                    <p className="text-sm text-neutral-200 leading-relaxed font-sans">{j.rawText}</p>
                    {j.aiSummary && (
                      <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-xs font-mono text-emerald-400">
                        🤖 AI Insights: {j.aiSummary}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddHabitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4">
            <h3 className="text-xs tracking-[0.3em] font-medium text-neutral-400 uppercase">
              New Routine Habit
            </h3>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <input
                type="text"
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
                placeholder="e.g. Read 10 pages Measure Theory..."
                autoFocus
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40"
              />

              <div className="flex gap-2">
                {(['morning', 'evening', 'weekly'] as const).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setHabitCategory(cat)}
                    className={`flex-1 py-2 text-xs uppercase font-mono rounded-lg border cursor-pointer ${
                      habitCategory === cat ? 'bg-white text-black font-bold' : 'border-white/10 text-neutral-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHabitModal(false)}
                  className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
