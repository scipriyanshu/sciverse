import React, { useState } from 'react';
import { Task, BlockedTarget } from '../types/lifeos';
import { Check, Plus, RefreshCw, Sparkles, Shield, AlertCircle } from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  blockedTargets: BlockedTarget[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, priority: 'high' | 'medium' | 'low') => void;
  onOpenBrainDump: () => void;
  aiCoachMessage: string;
  onRefreshCoach: () => void;
  isLoadingCoach: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  blockedTargets,
  onToggleTask,
  onAddTask,
  onOpenBrainDump,
  aiCoachMessage,
  onRefreshCoach,
  isLoadingCoach,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const missionScore = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 100;

  const activeTask = tasks.find((t) => !t.completed && t.isTopPriority) || tasks.find((t) => !t.completed) || tasks[0];
  const upcomingTasks = tasks.filter((t) => t.id !== activeTask?.id);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), 'high');
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto min-h-0 bg-[#0A0A0A]">
      {/* Left Column: The Mission */}
      <section className="w-full lg:w-3/5 p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between gap-8">
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase font-medium">
              The Mission
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 bg-neutral-900 border border-white/10 px-3 py-1 rounded-full transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Mission
            </button>
          </div>

          <div className="space-y-10 pl-6 border-l border-white/10 relative">
            {/* Active Mission */}
            {activeTask ? (
              <div className="group relative">
                {/* Active indicator line */}
                <div className="absolute -left-[25px] top-0 w-1 h-full bg-white rounded-r"></div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded inline-block mb-2">
                      Active Priority
                    </span>
                    <h3 className={`text-2xl md:text-4xl font-light text-white transition-all ${activeTask.completed ? 'line-through opacity-40' : ''}`}>
                      {activeTask.title}
                    </h3>
                    <p className="text-neutral-500 mt-2 font-mono text-xs">
                      Focus Window: {activeTask.focusWindow || '09:00 — 11:30 | 45m remaining'}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleTask(activeTask.id)}
                    className={`w-7 h-7 rounded border transition-all flex items-center justify-center shrink-0 mt-1 cursor-pointer ${
                      activeTask.completed
                        ? 'bg-white border-white text-black'
                        : 'border-white/30 hover:border-white text-transparent hover:text-neutral-500'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-neutral-500 font-mono text-xs italic">All missions completed. Great job!</div>
            )}

            {/* Upcoming Missions */}
            {upcomingTasks.map((task) => (
              <div key={task.id} className={`group flex items-start justify-between gap-4 transition-all ${task.completed ? 'opacity-30' : 'opacity-60 hover:opacity-100'}`}>
                <div>
                  <h3 className={`text-xl md:text-3xl font-light text-white ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-neutral-400 mt-1.5 font-mono text-xs">
                    Scheduled: {task.scheduledTime || task.deadline || '17:00'}
                  </p>
                </div>

                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`w-6 h-6 rounded border transition-all flex items-center justify-center shrink-0 mt-1 cursor-pointer ${
                    task.completed
                      ? 'bg-white border-white text-black'
                      : 'border-white/20 hover:border-white/50 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Coach Banner */}
        <div className="mt-8">
          <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-lg relative overflow-hidden group">
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className="text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                — AI Coach
              </span>
              <button
                onClick={onRefreshCoach}
                disabled={isLoadingCoach}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                title="Refresh AI advice"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCoach ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-neutral-300 italic font-sans leading-relaxed">
              “{aiCoachMessage}”
            </p>
          </div>
        </div>
      </section>

      {/* Right Column: Metrics & Brain Dump */}
      <section className="w-full lg:w-2/5 flex flex-col justify-between">
        {/* Metrics Grid */}
        <div className="p-6 md:p-10 border-b border-white/10 flex-1">
          <h2 className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase font-medium mb-6">
            Metrics
          </h2>

          <div className="grid grid-cols-2 gap-6 md:gap-8">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light tracking-tighter text-white font-mono">
                {missionScore}%
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                Mission Score
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light tracking-tighter text-white font-mono">
                6h 42m
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                Deep Sleep
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light tracking-tighter text-white font-mono">
                0.5h
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                Screentime
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light tracking-tighter text-red-500 font-mono">
                Blocked
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-red-500" /> Instagram
              </span>
            </div>
          </div>
        </div>

        {/* Brain Dump Tile */}
        <div className="p-6 md:p-10 flex-1 flex flex-col justify-center">
          <h2 className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase font-medium mb-6">
            Brain Dump
          </h2>

          <button
            onClick={onOpenBrainDump}
            className="w-full min-h-[160px] border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-white/50 transition-all bg-white/5 group cursor-pointer p-6"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform bg-neutral-900 shadow-inner">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="text-center">
              <p className="text-xs tracking-widest uppercase text-neutral-300 font-medium">
                Press to speak / dump thoughts
              </p>
              <p className="text-[10px] text-neutral-500 font-mono mt-1">
                AI auto-converts speech to tasks & priorities
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Add Mission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xs tracking-[0.3em] font-medium text-neutral-400 uppercase mb-4">
              New Mission
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Solve 3 Measure Theory problems..."
                autoFocus
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200"
                >
                  Save Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
