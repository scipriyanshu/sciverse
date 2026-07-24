import { Task, Habit, JournalEntry, Flashcard, BlockedTarget } from '../types/lifeos';

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Study Measure Theory',
    priority: 'high',
    deadline: 'Today 11:30',
    category: 'Academics',
    completed: false,
    focusWindow: '09:00 — 11:30 | 45m remaining',
    scheduledTime: '09:00',
    estimatedMinutes: 150,
    isTopPriority: true,
  },
  {
    id: 'task-2',
    title: 'Daily Workout',
    priority: 'medium',
    deadline: 'Today 17:00',
    category: 'Health',
    completed: false,
    scheduledTime: '17:00',
    estimatedMinutes: 45,
    isTopPriority: true,
  },
  {
    id: 'task-3',
    title: 'Research Paper Synthesis',
    priority: 'medium',
    deadline: 'Today 19:30',
    category: 'Research',
    completed: false,
    scheduledTime: '19:30',
    estimatedMinutes: 90,
    isTopPriority: true,
  },
  {
    id: 'task-4',
    title: 'No Instagram / Social Media',
    priority: 'high',
    deadline: 'All Day',
    category: 'Dopamine Shield',
    completed: false,
    scheduledTime: 'Continuous',
    estimatedMinutes: 0,
    isTopPriority: false,
  },
];

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', title: 'Hydrate 500ml Water', category: 'morning', streak: 12, completedToday: true, xpReward: 25 },
  { id: 'h2', title: '10 Min Sunlight Exposure', category: 'morning', streak: 8, completedToday: true, xpReward: 30 },
  { id: 'h3', title: 'Read 15 Pages Research', category: 'evening', streak: 5, completedToday: false, xpReward: 50 },
  { id: 'h4', title: 'No Phone 1h Before Sleep', category: 'evening', streak: 14, completedToday: false, xpReward: 40 },
];

const DEFAULT_BLOCKED: BlockedTarget[] = [
  { id: 'b1', name: 'Instagram', category: 'Social Media', blocked: true, timeSpentToday: '0m' },
  { id: 'b2', name: 'YouTube / Shorts', category: 'Video Distraction', blocked: true, timeSpentToday: '12m' },
  { id: 'b3', name: 'Reddit & Feeds', category: 'Forum Trap', blocked: true, timeSpentToday: '5m' },
  { id: 'b4', name: 'Discord / Gaming', category: 'Chat & Gaming', blocked: true, timeSpentToday: '0m' },
];

const DEFAULT_FLASHCARDS: Flashcard[] = [
  { id: 'f1', question: 'What is a Lebesgue Measurable Set?', answer: 'A set E ⊂ R^n is Lebesgue measurable if for every set A ⊂ R^n, m*(A) = m*(A ∩ E) + m*(A ∩ E^c).', mastered: false },
  { id: 'f2', question: 'State Fatou\'s Lemma', answer: 'If {fn} is a sequence of non-negative measurable functions, then ∫ liminf fn ≤ liminf ∫ fn.', mastered: true },
  { id: 'f3', question: 'What is the Monotone Convergence Theorem?', answer: 'If fn ↑ f pointwise with fn ≥ 0 measurable, then lim ∫ fn = ∫ f.', mastered: false },
];

const KEYS = {
  TASKS: 'lifeos_tasks_v1',
  HABITS: 'lifeos_habits_v1',
  BLOCKED: 'lifeos_blocked_v1',
  JOURNALS: 'lifeos_journals_v1',
  FLASHCARDS: 'lifeos_flashcards_v1',
  USER_NAME: 'lifeos_user_name_v1',
  SHIELD_ACTIVE: 'lifeos_shield_active_v1',
  METRICS: 'lifeos_metrics_v1',
  XP_LEVEL: 'lifeos_xp_level_v1'
};

export const storage = {
  getUserName: (): string => localStorage.getItem(KEYS.USER_NAME) || 'Priyanshu',
  setUserName: (name: string) => localStorage.setItem(KEYS.USER_NAME, name),

  getShieldActive: (): boolean => localStorage.getItem(KEYS.SHIELD_ACTIVE) !== 'false',
  setShieldActive: (active: boolean) => localStorage.setItem(KEYS.SHIELD_ACTIVE, String(active)),

  getTasks: (): Task[] => {
    try {
      const raw = localStorage.getItem(KEYS.TASKS);
      return raw ? JSON.parse(raw) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },
  saveTasks: (tasks: Task[]) => localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks)),

  getHabits: (): Habit[] => {
    try {
      const raw = localStorage.getItem(KEYS.HABITS);
      return raw ? JSON.parse(raw) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  },
  saveHabits: (habits: Habit[]) => localStorage.setItem(KEYS.HABITS, JSON.stringify(habits)),

  getBlocked: (): BlockedTarget[] => {
    try {
      const raw = localStorage.getItem(KEYS.BLOCKED);
      return raw ? JSON.parse(raw) : DEFAULT_BLOCKED;
    } catch {
      return DEFAULT_BLOCKED;
    }
  },
  saveBlocked: (blocked: BlockedTarget[]) => localStorage.setItem(KEYS.BLOCKED, JSON.stringify(blocked)),

  getJournals: (): JournalEntry[] => {
    try {
      const raw = localStorage.getItem(KEYS.JOURNALS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  saveJournals: (journals: JournalEntry[]) => localStorage.setItem(KEYS.JOURNALS, JSON.stringify(journals)),

  getFlashcards: (): Flashcard[] => {
    try {
      const raw = localStorage.getItem(KEYS.FLASHCARDS);
      return raw ? JSON.parse(raw) : DEFAULT_FLASHCARDS;
    } catch {
      return DEFAULT_FLASHCARDS;
    }
  },
  saveFlashcards: (cards: Flashcard[]) => localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(cards)),

  getXp: (): number => {
    return parseInt(localStorage.getItem(KEYS.XP_LEVEL) || '420', 10);
  },
  addXp: (amount: number): number => {
    const current = storage.getXp();
    const updated = current + amount;
    localStorage.setItem(KEYS.XP_LEVEL, String(updated));
    return updated;
  }
};
