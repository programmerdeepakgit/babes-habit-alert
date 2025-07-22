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
    const message = `Babes. It's time of ${activity.name}`;
    
    // Show browser notification if permission granted
    if (permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: activity.id,
        requireInteraction: true,
      });
    }

    // Voice announcement using Speech Synthesis API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
      // Try to use a female voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') || 
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('microsoft')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // Ensure voices are loaded before speaking
      if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          const newVoices = speechSynthesis.getVoices();
          const newFemaleVoice = newVoices.find(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('samantha')
          );
          if (newFemaleVoice) {
            utterance.voice = newFemaleVoice;
          }
          speechSynthesis.speak(utterance);
        };
      } else {
        speechSynthesis.speak(utterance);
      }
    }

    // Also show toast notification
    toast({
      title: title,
      description: message,
      duration: 8000,
    });

    // Play system notification sound
    try {
      // Create audio context for a simple beep
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('🔔 Notification:', message);
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