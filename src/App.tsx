import React, { useState, useEffect } from 'react';
import { Task, Habit, JournalEntry, Flashcard, BlockedTarget, ActiveTab } from './types/lifeos';
import { storage } from './utils/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { BrainDumpView } from './components/BrainDumpView';
import { FocusModeView } from './components/FocusModeView';
import { HabitsJournalView } from './components/HabitsJournalView';
import { VaultToolsView } from './components/VaultToolsView';
import { EmergencyUnlockModal } from './components/EmergencyUnlockModal';
import { AIPlannerModal } from './components/AIPlannerModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AndroidBridgeModal } from './components/AndroidBridgeModal';

export default function App() {
  const [userName, setUserName] = useState<string>(() => storage.getUserName());
  const [shieldActive, setShieldActive] = useState<boolean>(() => storage.getShieldActive());
  const [xp, setXp] = useState<number>(() => storage.getXp());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [habits, setHabits] = useState<Habit[]>(() => storage.getHabits());
  const [blockedTargets, setBlockedTargets] = useState<BlockedTarget[]>(() => storage.getBlocked());
  const [journals, setJournals] = useState<JournalEntry[]>(() => storage.getJournals());
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => storage.getFlashcards());

  const [aiCoachMessage, setAiCoachMessage] = useState(
    "You haven't touched Measure Theory in 3 days. Focus on the core proof—I've blocked everything else."
  );
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);

  // Modals
  const [editingName, setEditingName] = useState(false);
  const [newNameInput, setNewNameInput] = useState(userName);
  const [emergencyTarget, setEmergencyTarget] = useState<string | null>(null);
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAndroidBridge, setShowAndroidBridge] = useState(false);

  // Persist state changes
  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    storage.saveBlocked(blockedTargets);
  }, [blockedTargets]);

  useEffect(() => {
    storage.saveJournals(journals);
  }, [journals]);

  useEffect(() => {
    storage.saveFlashcards(flashcards);
  }, [flashcards]);

  const handleToggleShield = () => {
    const updated = !shieldActive;
    setShieldActive(updated);
    storage.setShieldActive(updated);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameInput.trim()) return;
    setUserName(newNameInput.trim());
    storage.setUserName(newNameInput.trim());
    setEditingName(false);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedCompleted = !t.completed;
          if (updatedCompleted) {
            const newXp = storage.addXp(35);
            setXp(newXp);
          }
          return { ...t, completed: updatedCompleted };
        }
        return t;
      })
    );
  };

  const handleAddTask = (title: string, priority: 'high' | 'medium' | 'low') => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      priority,
      deadline: 'Today',
      category: 'Mission',
      completed: false,
      scheduledTime: 'Now',
      estimatedMinutes: 30,
      isTopPriority: priority === 'high',
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddConvertedTasks = (newTasks: Task[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
    setActiveTab('dashboard');
    const updatedXp = storage.addXp(20);
    setXp(updatedXp);
  };

  const handleToggleHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isComp = !h.completedToday;
          if (isComp) {
            const newXp = storage.addXp(h.xpReward);
            setXp(newXp);
          }
          return {
            ...h,
            completedToday: isComp,
            streak: isComp ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (title: string, category: 'morning' | 'evening' | 'weekly', xpReward: number) => {
    const newH: Habit = {
      id: `h-${Date.now()}`,
      title,
      category,
      streak: 1,
      completedToday: false,
      xpReward,
    };
    setHabits((prev) => [...prev, newH]);
  };

  const handleSaveJournal = (mood: 'good' | 'neutral' | 'bad', rawText: string, aiSummary: string) => {
    const entry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      mood,
      rawText,
      aiSummary,
      keyWin: 'Completed daily focus window.',
    };
    setJournals((prev) => [entry, ...prev]);
    const updatedXp = storage.addXp(40);
    setXp(updatedXp);
  };

  const handleAddFlashcards = (newCards: Flashcard[]) => {
    setFlashcards((prev) => [...newCards, ...prev]);
  };

  const handleToggleMastered = (id: string) => {
    setFlashcards((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const isMast = !f.mastered;
          if (isMast) {
            const updatedXp = storage.addXp(20);
            setXp(updatedXp);
          }
          return { ...f, mastered: isMast };
        }
        return f;
      })
    );
  };

  const handleRefreshCoach = async () => {
    setIsLoadingCoach(true);
    try {
      const activeT = tasks.find((t) => !t.completed)?.title || 'Measure Theory';
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentTask: activeT, minutesIdle: 25 }),
      });
      const data = await res.json();
      if (data.nudge) {
        setAiCoachMessage(data.nudge);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCoach(false);
    }
  };

  const handleApplyTop3Planner = (top3Ids: string[]) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        isTopPriority: top3Ids.includes(t.id),
      }))
    );
    setActiveTab('dashboard');
  };

  const handleGrantPass = (targetName: string) => {
    setBlockedTargets((prev) =>
      prev.map((b) => (b.name === targetName ? { ...b, blocked: false } : b))
    );
  };

  return (
    <div className="h-full w-full bg-[#0A0A0A] text-white flex flex-col font-sans overflow-hidden border-0 lg:border-8 border-[#1A1A1A] selection:bg-neutral-800">
      {/* Header */}
      <Header
        userName={userName}
        shieldActive={shieldActive}
        xp={xp}
        onEditName={() => {
          setNewNameInput(userName);
          setEditingName(true);
        }}
        onToggleShield={handleToggleShield}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenAndroidBridge={() => setShowAndroidBridge(true)}
      />

      {/* Main Content Router */}
      {activeTab === 'dashboard' && (
        <DashboardView
          tasks={tasks}
          blockedTargets={blockedTargets}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onOpenBrainDump={() => setActiveTab('braindump')}
          aiCoachMessage={aiCoachMessage}
          onRefreshCoach={handleRefreshCoach}
          isLoadingCoach={isLoadingCoach}
        />
      )}

      {activeTab === 'braindump' && (
        <BrainDumpView onAddConvertedTasks={handleAddConvertedTasks} />
      )}

      {activeTab === 'focus' && (
        <FocusModeView
          tasks={tasks}
          blockedTargets={blockedTargets}
          onOpenEmergencyUnlock={(target) => setEmergencyTarget(target)}
        />
      )}

      {activeTab === 'habits' && (
        <HabitsJournalView
          habits={habits}
          journals={journals}
          xp={xp}
          onToggleHabit={handleToggleHabit}
          onAddHabit={handleAddHabit}
          onSaveJournal={handleSaveJournal}
        />
      )}

      {activeTab === 'vault' && (
        <VaultToolsView
          flashcards={flashcards}
          onAddFlashcards={handleAddFlashcards}
          onToggleMastered={handleToggleMastered}
        />
      )}

      {/* Footer Nav Bar */}
      <Footer
        activeTab={activeTab}
        setTab={setActiveTab}
        onEnterStudyMode={() => setActiveTab('focus')}
        onOpenPlanner={() => setShowPlannerModal(true)}
      />

      {/* Modals */}
      {editingName && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 max-w-sm w-full space-y-4">
            <h3 className="text-xs tracking-[0.3em] font-medium text-neutral-400 uppercase">
              Edit User Name
            </h3>
            <form onSubmit={handleSaveName} className="space-y-4">
              <input
                type="text"
                value={newNameInput}
                onChange={(e) => setNewNameInput(e.target.value)}
                autoFocus
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingName(false)}
                  className="px-4 py-2 text-xs uppercase text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black px-6 py-2 text-xs font-bold uppercase rounded-full"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {emergencyTarget && (
        <EmergencyUnlockModal
          targetName={emergencyTarget}
          onClose={() => setEmergencyTarget(null)}
          onGrantPass={handleGrantPass}
        />
      )}

      {showPlannerModal && (
        <AIPlannerModal
          tasks={tasks.filter((t) => !t.completed)}
          onClose={() => setShowPlannerModal(false)}
          onApplyTop3={handleApplyTop3Planner}
        />
      )}

      {showOnboarding && (
        <OnboardingModal
          userName={userName}
          onClose={() => setShowOnboarding(false)}
          onComplete={(profile) => {
            setShowOnboarding(false);
            if (profile.primaryGoal) {
              handleAddTask(profile.primaryGoal, 'high');
            }
          }}
        />
      )}

      {showAndroidBridge && (
        <AndroidBridgeModal onClose={() => setShowAndroidBridge(false)} />
      )}
    </div>
  );
}
