import { DaySchedule, WeekEntry, DEFAULT_SCHEDULES } from '@/types/habit';

const STORAGE_KEYS = {
  WEEK_ENTRIES: 'babes_habit_week_entries',
  DAY_SCHEDULES: 'babes_habit_day_schedules',
  CURRENT_WEEK: 'babes_habit_current_week',
  CUSTOM_SCHEDULES: 'babes_habit_custom_schedules',
} as const;

export const storage = {
  // Week entries management
  saveWeekEntry: (weekEntry: WeekEntry): void => {
    const entries = storage.getWeekEntries();
    const existingIndex = entries.findIndex(e => e.weekStart === weekEntry.weekStart);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = weekEntry;
    } else {
      entries.push(weekEntry);
    }
    
    localStorage.setItem(STORAGE_KEYS.WEEK_ENTRIES, JSON.stringify(entries));
  },

  getWeekEntries: (): WeekEntry[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.WEEK_ENTRIES);
    return stored ? JSON.parse(stored) : [];
  },

  // Day schedules management
  saveDaySchedule: (schedule: DaySchedule): void => {
    const schedules = storage.getDaySchedules();
    const existingIndex = schedules.findIndex(s => s.date === schedule.date);
    
    if (existingIndex >= 0) {
      schedules[existingIndex] = schedule;
    } else {
      schedules.push(schedule);
    }
    
    localStorage.setItem(STORAGE_KEYS.DAY_SCHEDULES, JSON.stringify(schedules));
  },

  getDaySchedules: (): DaySchedule[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.DAY_SCHEDULES);
    return stored ? JSON.parse(stored) : [];
  },

  getDaySchedule: (date: string): DaySchedule | null => {
    const schedules = storage.getDaySchedules();
    return schedules.find(s => s.date === date) || null;
  },

  // Utility functions
  formatDate: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  getStartOfWeek: (date: Date): Date => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    return startOfWeek;
  },

  isToday: (dateString: string): boolean => {
    const today = new Date();
    return storage.formatDate(today) === dateString;
  },

  // Custom schedule management
  saveCustomSchedule: (type: 'onday' | 'offday', activities: {time: string, name: string}[]): void => {
    const customSchedules = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_SCHEDULES) || '{}');
    customSchedules[type] = activities;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SCHEDULES, JSON.stringify(customSchedules));
  },

  getCustomSchedule: (type: 'onday' | 'offday'): {time: string, name: string}[] | null => {
    const customSchedules = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_SCHEDULES) || '{}');
    return customSchedules[type] || null;
  },

  resetToDefault: (type: 'onday' | 'offday'): void => {
    const customSchedules = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_SCHEDULES) || '{}');
    customSchedules[type] = DEFAULT_SCHEDULES[type];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SCHEDULES, JSON.stringify(customSchedules));
  },

  clearAllSchedules: (): void => {
    localStorage.removeItem(STORAGE_KEYS.DAY_SCHEDULES);
  },

  clearAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};