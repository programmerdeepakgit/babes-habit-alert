export interface Activity {
  id: string;
  time: string;
  name: string;
  completed?: boolean;
  completedAt?: Date;
}

export interface DaySchedule {
  date: string;
  type: 'onday' | 'offday';
  activities: Activity[];
}

export interface WeekEntry {
  weekStart: string;
  schedulePattern: {
    ondays: string[];
    offdays: string[];
  };
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description?: string;
  lastSubmitDate: string;
  isCompleted: boolean;
  completedAt?: Date;
  notificationTime?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export const DEFAULT_SCHEDULES = {
  onday: [
    { time: '05:00', name: 'Meditation & Wake' },
    { time: '06:00', name: 'Ready for Coaching' },
    { time: '07:00', name: 'Travel Time' },
    { time: '07:56', name: 'Classes Time' },
    { time: '14:30', name: 'Travel Time' },
    { time: '15:30', name: 'Reached Home' },
    { time: '17:00', name: 'Practice Time' },
    { time: '20:00', name: 'Revision' },
    { time: '21:00', name: 'Code World' },
    { time: '22:30', name: 'Bedtime' },
  ],
  offday: [
    { time: '05:00', name: 'Meditation & Walking' },
    { time: '06:00', name: 'Take Bath & Ready' },
    { time: '07:00', name: 'Learning English' },
    { time: '09:00', name: 'Learning I.P' },
    { time: '11:00', name: 'Revision' },
    { time: '13:00', name: 'Break Time' },
    { time: '15:00', name: 'Practice Questions' },
    { time: '18:00', name: 'Backlog Time' },
    { time: '19:00', name: 'Code World' },
    { time: '21:30', name: 'Bed Time' },
  ],
};