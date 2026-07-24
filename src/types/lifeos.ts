export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  category: string;
  completed: boolean;
  focusWindow?: string;
  scheduledTime?: string;
  estimatedMinutes?: number;
  isTopPriority?: boolean;
}

export interface Habit {
  id: string;
  title: string;
  category: 'morning' | 'evening' | 'weekly';
  streak: number;
  completedToday: boolean;
  xpReward: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: 'good' | 'neutral' | 'bad';
  rawText: string;
  aiSummary: string;
  keyWin: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mastered: boolean;
}

export interface BlockedTarget {
  id: string;
  name: string;
  category: string;
  blocked: boolean;
  timeSpentToday: string;
  tempUnlockedUntil?: number; // timestamp
}

export type ActiveTab = 'dashboard' | 'braindump' | 'focus' | 'habits' | 'vault';
