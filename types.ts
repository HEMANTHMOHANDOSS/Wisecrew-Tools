
import { LucideIcon } from "lucide-react";

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
  category: ToolCategory;
}

export type ToolCategory = 'finance' | 'student' | 'productivity' | 'daily' | 'converters' | 'ai' | 'developer' | 'personal';

export interface CategoryMeta {
  id: ToolCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  isRecurring?: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedDates: string[]; // ISO date strings
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  theme: AppTheme;
  language: AppLanguage;
  avatar?: string;
  history: HistoryItem[];
  xp: number;
  level: number;
  badges: string[];
}

export interface HistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  result: string;
  timestamp: number;
}

export type AppTheme = 'light' | 'dark' | 'glass' | 'amoled';
export type AppLanguage = 'en' | 'hi' | 'ta' | 'te';

export interface TimeTableItem {
  day: string;
  subjects: { time: string; subject: string }[];
}

export interface Goal {
  id: string;
  title: string;
  deadline: string;
  progress: number;
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'submitted';
}

export interface TimeBlock {
  id: string;
  time: string;
  task: string;
  type: 'work' | 'break' | 'personal';
}
