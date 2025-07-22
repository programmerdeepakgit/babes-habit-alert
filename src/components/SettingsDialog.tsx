import { useState } from 'react';
import { Plus, Trash2, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storage } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';

interface Activity {
  time: string;
  name: string;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [ondayActivities, setOndayActivities] = useState<Activity[]>(() => 
    storage.getCustomSchedule('onday') || []
  );
  const [offdayActivities, setOffdayActivities] = useState<Activity[]>(() => 
    storage.getCustomSchedule('offday') || []
  );

  const addActivity = (type: 'onday' | 'offday') => {
    const newActivity = { time: '09:00', name: 'New Activity' };
    if (type === 'onday') {
      setOndayActivities([...ondayActivities, newActivity].sort((a, b) => a.time.localeCompare(b.time)));
    } else {
      setOffdayActivities([...offdayActivities, newActivity].sort((a, b) => a.time.localeCompare(b.time)));
    }
  };

  const removeActivity = (type: 'onday' | 'offday', index: number) => {
    if (type === 'onday') {
      setOndayActivities(ondayActivities.filter((_, i) => i !== index));
    } else {
      setOffdayActivities(offdayActivities.filter((_, i) => i !== index));
    }
  };

  const updateActivity = (type: 'onday' | 'offday', index: number, field: 'time' | 'name', value: string) => {
    if (type === 'onday') {
      const updated = [...ondayActivities];
      updated[index] = { ...updated[index], [field]: value };
      setOndayActivities(updated.sort((a, b) => a.time.localeCompare(b.time)));
    } else {
      const updated = [...offdayActivities];
      updated[index] = { ...updated[index], [field]: value };
      setOffdayActivities(updated.sort((a, b) => a.time.localeCompare(b.time)));
    }
  };

  const saveSettings = () => {
    storage.saveCustomSchedule('onday', ondayActivities);
    storage.saveCustomSchedule('offday', offdayActivities);
    
    // Clear existing schedules so new ones get loaded
    storage.clearAllSchedules();
    
    toast({
      title: "Settings Saved",
      description: "Your custom schedules have been saved successfully!",
      duration: 3000,
    });
    
    onOpenChange(false);
  };

  const resetToDefault = (type: 'onday' | 'offday') => {
    storage.resetToDefault(type);
    if (type === 'onday') {
      setOndayActivities(storage.getCustomSchedule('onday') || []);
    } else {
      setOffdayActivities(storage.getCustomSchedule('offday') || []);
    }
    
    toast({
      title: "Reset to Default",
      description: `${type === 'onday' ? 'Onday' : 'Offday'} schedule reset to default.`,
      duration: 2000,
    });
  };

  const ActivityList = ({ type, activities }: { type: 'onday' | 'offday', activities: Activity[] }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">
          {type === 'onday' ? 'Onday Schedule' : 'Offday Schedule'}
        </h3>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => resetToDefault(type)}
            className="text-warning hover:bg-warning/10"
          >
            Reset
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => addActivity(type)}
            className="text-success hover:bg-success/10"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Time</Label>
                  <Input
                    type="time"
                    value={activity.time}
                    onChange={(e) => updateActivity(type, index, 'time', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Activity</Label>
                  <Input
                    value={activity.name}
                    onChange={(e) => updateActivity(type, index, 'name', e.target.value)}
                    className="text-sm"
                    placeholder="Activity name"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeActivity(type, index)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities added yet.</p>
            <p className="text-sm">Click "Add" to create your first activity.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-primary">Settings - Customize Activities</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="onday" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="onday" className="text-sm">Onday Schedule</TabsTrigger>
            <TabsTrigger value="offday" className="text-sm">Offday Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="onday" className="mt-4 overflow-y-auto max-h-[60vh]">
            <ActivityList type="onday" activities={ondayActivities} />
          </TabsContent>
          
          <TabsContent value="offday" className="mt-4 overflow-y-auto max-h-[60vh]">
            <ActivityList type="offday" activities={offdayActivities} />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveSettings} className="bg-gradient-primary text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};