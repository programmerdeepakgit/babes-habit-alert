import { Settings, Info, Bell, Smartphone, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface MenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsClick: () => void;
}

export const MenuSheet = ({ open, onOpenChange, onSettingsClick }: MenuSheetProps) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    onSettingsClick();
    onOpenChange(false);
  };

  const handleAssignmentsClick = () => {
    navigate('/assignments');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-primary font-bold">Babes Habit</h2>
                <p className="text-xs text-muted-foreground font-normal">
                  Designed By Programmer Deepak
                </p>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-left p-3 h-auto hover:bg-primary/10"
            onClick={handleSettingsClick}
          >
            <Settings className="w-5 h-5 mr-3 text-primary" />
            <div>
              <p className="font-medium">Settings</p>
              <p className="text-xs text-muted-foreground">Customize your activities</p>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-left p-3 h-auto hover:bg-primary/10"
            onClick={handleAssignmentsClick}
          >
            <BookOpen className="w-5 h-5 mr-3 text-primary" />
            <div>
              <p className="font-medium">Assignments</p>
              <p className="text-xs text-muted-foreground">Manage coaching assignments</p>
            </div>
          </Button>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-primary px-3">App Features</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                <Bell className="w-4 h-4" />
                <span>Voice & Text Notifications</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                <Settings className="w-4 h-4" />
                <span>Offline Data Storage</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Weekly Schedule Sync</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="px-3 py-4 text-center">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Fully Offline App</p>
              <p>No internet connection required</p>
              <p className="mt-2 text-primary font-medium">Version 1.0</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};