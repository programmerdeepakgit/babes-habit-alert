import { useState, useEffect } from 'react';
import { Activity } from '@/types/habit';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [scheduledNotifications, setScheduledNotifications] = useState<number[]>([]);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const scheduleNotification = (activity: Activity, scheduleDate: Date) => {
    const [hours, minutes] = activity.time.split(':').map(Number);
    const notificationTime = new Date(scheduleDate);
    notificationTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    if (timeUntilNotification > 0) {
      const timeoutId = window.setTimeout(() => {
        showNotification(activity);
        // Remove from scheduled list
        setScheduledNotifications(prev => prev.filter(id => id !== timeoutId));
      }, timeUntilNotification);

      setScheduledNotifications(prev => [...prev, timeoutId]);
      return timeoutId;
    }

    return null;
  };

  const showNotification = (activity: Activity) => {
    const title = "Babes Habit Alert";
    const body = `Babes. It's time of ${activity.name}`;
    
    // Show browser notification if permission granted
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: activity.id,
        requireInteraction: true,
      });
    }

    // Also show toast notification
    toast({
      title: title,
      description: body,
      duration: 10000,
    });

    // Play notification sound (if available)
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(() => {
        // Fallback: use system beep
        console.log('🔔 Notification:', body);
      });
    } catch (error) {
      console.log('🔔 Notification:', body);
    }
  };

  const scheduleActivitiesForDay = (activities: Activity[], date: Date) => {
    // Clear existing scheduled notifications
    clearScheduledNotifications();

    // Schedule new notifications for the day
    activities.forEach(activity => {
      if (!activity.completed) {
        scheduleNotification(activity, date);
      }
    });
  };

  const clearScheduledNotifications = () => {
    scheduledNotifications.forEach(id => clearTimeout(id));
    setScheduledNotifications([]);
  };

  const testNotification = () => {
    const testActivity: Activity = {
      id: 'test',
      time: new Date().toTimeString().substring(0, 5),
      name: 'Test Activity',
    };
    showNotification(testActivity);
  };

  return {
    permission,
    requestPermission,
    scheduleNotification,
    scheduleActivitiesForDay,
    clearScheduledNotifications,
    showNotification,
    testNotification,
  };
};