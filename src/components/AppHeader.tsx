import { Menu, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarPicker } from './CalendarPicker';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

interface AppHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onMenuClick: () => void;
}

export const AppHeader = ({ selectedDate, onDateChange, onMenuClick }: AppHeaderProps) => {
  const { permission, requestPermission, testNotification } = useNotifications();

  const handleNotificationSetup = async () => {
    if (permission === 'granted') {
      testNotification();
    } else {
      const granted = await requestPermission();
      if (granted) {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive alerts for all your activities!",
          duration: 3000,
        });
        testNotification();
      } else {
        toast({
          title: "Notifications Disabled",
          description: "Enable notifications in your browser settings to receive activity alerts.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="text-primary hover:bg-primary/10"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Center: App Title */}
          <div className="text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Babes Habit
            </h1>
            <p className="text-xs text-muted-foreground">Designed By Programmer Deepak</p>
          </div>

          {/* Right: Calendar & Notifications */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotificationSetup}
              className={`${
                permission === 'granted' 
                  ? 'text-success hover:bg-success/10' 
                  : 'text-warning hover:bg-warning/10'
              }`}
            >
              <Bell className="w-5 h-5" />
            </Button>
            <CalendarPicker
              selected={selectedDate}
              onSelect={onDateChange}
              className="hidden sm:flex"
            />
          </div>
        </div>

        {/* Mobile Calendar */}
        <div className="sm:hidden mt-3">
          <CalendarPicker
            selected={selectedDate}
            onSelect={onDateChange}
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
};