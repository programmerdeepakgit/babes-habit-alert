import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { ActivityCard } from '@/components/ActivityCard';
import { AddActivityDialog } from '@/components/AddActivityDialog';
import { StatsCard } from '@/components/StatsCard';
import { useHabits } from '@/hooks/useHabits';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showMenu, setShowMenu] = useState(false);
  const {
    selectedDate,
    setSelectedDate,
    currentSchedule,
    loading,
    toggleActivity,
    addActivity,
    getCompletionStats,
  } = useHabits();

  const { scheduleActivitiesForDay, permission } = useNotifications();

  // Schedule notifications when date or activities change
  useEffect(() => {
    if (currentSchedule && permission === 'granted') {
      scheduleActivitiesForDay(currentSchedule.activities, selectedDate);
    }
  }, [currentSchedule, selectedDate, permission, scheduleActivitiesForDay]);

  const stats = getCompletionStats();
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
    toast({
      title: "Menu",
      description: "Settings and more features coming soon!",
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <AppHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onMenuClick={handleMenuClick}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Card */}
        <StatsCard
          completed={stats.completed}
          total={stats.total}
          percentage={stats.percentage}
          date={selectedDate}
        />

        {/* Schedule Type Indicator */}
        {currentSchedule && (
          <div className="text-center p-3 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Schedule Type: <span className="font-semibold text-primary capitalize">{currentSchedule.type}</span>
            </p>
            {isToday && (
              <p className="text-xs text-success mt-1">
                Today's activities • Notifications {permission === 'granted' ? 'enabled' : 'disabled'}
              </p>
            )}
          </div>
        )}

        {/* Activities List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isToday ? "Today's Activities" : `Activities for ${selectedDate.toLocaleDateString()}`}
            </h2>
            <span className="text-sm text-muted-foreground">
              {currentSchedule?.activities.length || 0} activities
            </span>
          </div>

          {currentSchedule?.activities.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">📅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">No activities yet</h3>
                <p className="text-muted-foreground">Add your first activity to get started!</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {currentSchedule?.activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onToggle={toggleActivity}
                  isUpcoming={activity.time > new Date().toTimeString().substring(0, 5) && isToday}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Activity Button */}
        <div className="sticky bottom-6">
          <AddActivityDialog onAdd={addActivity} />
        </div>
      </main>
    </div>
  );
};

export default Index;
