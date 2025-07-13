import { Check, Clock, Plus } from 'lucide-react';
import { Activity } from '@/types/habit';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  onToggle: (id: string) => void;
  isUpcoming?: boolean;
}

export const ActivityCard = ({ activity, onToggle, isUpcoming = false }: ActivityCardProps) => {
  const currentTime = new Date().toTimeString().substring(0, 5);
  const isCurrentTime = activity.time === currentTime;
  const isPastTime = activity.time < currentTime;

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg border-2",
      activity.completed ? "bg-success/10 border-success/30" : "bg-card border-border",
      isCurrentTime && "ring-2 ring-primary ring-offset-2 shadow-soft",
      isUpcoming && "border-warning/50 bg-warning/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full transition-all",
              activity.completed 
                ? "bg-success text-success-foreground" 
                : isCurrentTime 
                ? "bg-primary text-primary-foreground animate-pulse"
                : "bg-muted text-muted-foreground"
            )}>
              {activity.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {activity.time}
              </p>
              <h3 className={cn(
                "font-semibold text-base",
                activity.completed && "line-through text-muted-foreground"
              )}>
                {activity.name}
              </h3>
              {activity.completed && activity.completedAt && (
                <p className="text-xs text-success">
                  Completed at {new Date(activity.completedAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={() => onToggle(activity.id)}
            variant={activity.completed ? "outline" : "default"}
            size="sm"
            className={cn(
              "transition-all",
              activity.completed && "border-success text-success hover:bg-success hover:text-success-foreground"
            )}
          >
            {activity.completed ? 'Undo' : 'Complete'}
          </Button>
        </div>

        {isCurrentTime && !activity.completed && (
          <div className="mt-3 p-2 bg-primary/10 rounded-lg">
            <p className="text-sm text-primary font-medium text-center">
              🔔 Babes. It's time of {activity.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};