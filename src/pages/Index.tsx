import { useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { AppHeader } from '@/components/AppHeader';
import { ActivityCard } from '@/components/ActivityCard';
import { AddActivityDialog } from '@/components/AddActivityDialog';
import { StatsCard } from '@/components/StatsCard';
import { MenuSheet } from '@/components/MenuSheet';
import { SettingsDialog } from '@/components/SettingsDialog';
import { PendingAssignments } from '@/components/PendingAssignments';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const {
    selectedDate,
    setSelectedDate,
    currentSchedule,
    loading,
    toggleActivity,
    addActivity,
    getCompletionStats,
  } = useHabits();

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
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

  const stats = getCompletionStats();
  const isToday = selectedDate.toDateString() === new Date().toDateString();

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

        {/* Pending Assignments */}
        <PendingAssignments />

        {/* Schedule Type Indicator */}
        {currentSchedule && (
          <div className="text-center p-3 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Schedule Type: <span className="font-semibold text-primary capitalize">{currentSchedule.type}</span>
            </p>
            {isToday && (
              <p className="text-xs text-success mt-1">
                Today's activities • Fully offline app
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

        {/* Add Activity Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6">
          <AddActivityDialog onAdd={addActivity} />
        </div>
      </main>

      <MenuSheet
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        onSettingsClick={handleSettingsClick}
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

    </div>
  );
};

export default Index;