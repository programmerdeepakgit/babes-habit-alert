import { Assignment } from '@/types/habit';

const ASSIGNMENT_STORAGE_KEY = 'babes_habit_assignments';

export const assignmentStorage = {
  // Get all assignments
  getAssignments: (): Assignment[] => {
    const stored = localStorage.getItem(ASSIGNMENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Save or update an assignment
  saveAssignment: (assignment: Assignment): void => {
    const assignments = assignmentStorage.getAssignments();
    const existingIndex = assignments.findIndex(a => a.id === assignment.id);
    
    if (existingIndex >= 0) {
      assignments[existingIndex] = assignment;
    } else {
      assignments.push(assignment);
    }
    
    localStorage.setItem(ASSIGNMENT_STORAGE_KEY, JSON.stringify(assignments));
  },

  // Delete an assignment
  deleteAssignment: (assignmentId: string): void => {
    const assignments = assignmentStorage.getAssignments();
    const filtered = assignments.filter(a => a.id !== assignmentId);
    localStorage.setItem(ASSIGNMENT_STORAGE_KEY, JSON.stringify(filtered));
  },

  // Get pending assignments
  getPendingAssignments: (): Assignment[] => {
    return assignmentStorage.getAssignments().filter(a => !a.isCompleted);
  },

  // Get completed assignments
  getCompletedAssignments: (): Assignment[] => {
    return assignmentStorage.getAssignments().filter(a => a.isCompleted);
  },

  // Get overdue assignments
  getOverdueAssignments: (): Assignment[] => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    return assignmentStorage.getPendingAssignments().filter(assignment => {
      const deadline = new Date(assignment.lastSubmitDate);
      return deadline < today;
    });
  },

  // Get urgent assignments (due within 2 days)
  getUrgentAssignments: (): Assignment[] => {
    const today = new Date();
    const urgentDate = new Date(today);
    urgentDate.setDate(today.getDate() + 2);
    
    return assignmentStorage.getPendingAssignments().filter(assignment => {
      const deadline = new Date(assignment.lastSubmitDate);
      return deadline <= urgentDate && deadline >= today;
    });
  },

  // Get assignments with notifications scheduled for today
  getAssignmentsWithNotificationsToday: (): Assignment[] => {
    return assignmentStorage.getPendingAssignments().filter(assignment => 
      assignment.notificationTime && assignment.notificationTime.length > 0
    );
  },

  // Clear all assignments (for testing/reset)
  clearAllAssignments: (): void => {
    localStorage.removeItem(ASSIGNMENT_STORAGE_KEY);
  },

  // Get assignment statistics
  getAssignmentStats: () => {
    const all = assignmentStorage.getAssignments();
    const pending = assignmentStorage.getPendingAssignments();
    const completed = assignmentStorage.getCompletedAssignments();
    const overdue = assignmentStorage.getOverdueAssignments();
    const urgent = assignmentStorage.getUrgentAssignments();
    
    return {
      total: all.length,
      pending: pending.length,
      completed: completed.length,
      overdue: overdue.length,
      urgent: urgent.length,
      completionRate: all.length > 0 ? Math.round((completed.length / all.length) * 100) : 0,
    };
  }
};