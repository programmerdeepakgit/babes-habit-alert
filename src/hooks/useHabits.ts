import { useState, useEffect } from 'react';
import { DaySchedule, Activity, DEFAULT_SCHEDULES } from '@/types/habit';
import { storage } from '@/utils/storage';

export const useHabits = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentSchedule, setCurrentSchedule] = useState<DaySchedule | null>(null);
  const [loading, setLoading] = useState(true);

  // Get schedule for a specific date
  const getScheduleForDate = (date: Date): DaySchedule => {
    const dateString = storage.formatDate(date);
    const existingSchedule = storage.getDaySchedule(dateString);
    
    if (existingSchedule) {
      return existingSchedule;
    }

    // Determine if it's onday or offday (default: onday for weekdays, offday for weekends)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const scheduleType = isWeekend ? 'offday' : 'onday';
    
    const activities: Activity[] = DEFAULT_SCHEDULES[scheduleType].map((activity, index) => ({
      id: `${dateString}_${index}`,
      time: activity.time,
      name: activity.name,
      completed: false,
    }));

    const newSchedule: DaySchedule = {
      date: dateString,
      type: scheduleType,
      activities,
    };

    // Save the new schedule
    storage.saveDaySchedule(newSchedule);
    
    return newSchedule;
  };

  // Load schedule when date changes
  useEffect(() => {
    setLoading(true);
    const schedule = getScheduleForDate(selectedDate);
    setCurrentSchedule(schedule);
    setLoading(false);
  }, [selectedDate]);

  // Toggle activity completion
  const toggleActivity = (activityId: string) => {
    if (!currentSchedule) return;

    const updatedActivities = currentSchedule.activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          completed: !activity.completed,
          completedAt: !activity.completed ? new Date() : undefined,
        };
      }
      return activity;
    });

    const updatedSchedule = {
      ...currentSchedule,
      activities: updatedActivities,
    };

    setCurrentSchedule(updatedSchedule);
    storage.saveDaySchedule(updatedSchedule);
  };

  // Add new activity
  const addActivity = (time: string, name: string) => {
    if (!currentSchedule) return;

    const newActivity: Activity = {
      id: `${currentSchedule.date}_${Date.now()}`,
      time,
      name,
      completed: false,
    };

    const updatedActivities = [...currentSchedule.activities, newActivity].sort((a, b) => 
      a.time.localeCompare(b.time)
    );

    const updatedSchedule = {
      ...currentSchedule,
      activities: updatedActivities,
    };

    setCurrentSchedule(updatedSchedule);
    storage.saveDaySchedule(updatedSchedule);
  };

  // Get today's schedule
  const getTodaySchedule = () => {
    return getScheduleForDate(new Date());
  };

  // Get completion stats
  const getCompletionStats = () => {
    if (!currentSchedule) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = currentSchedule.activities.filter(a => a.completed).length;
    const total = currentSchedule.activities.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  return {
    selectedDate,
    setSelectedDate,
    currentSchedule,
    loading,
    toggleActivity,
    addActivity,
    getTodaySchedule,
    getCompletionStats,
    getScheduleForDate,
  };
};