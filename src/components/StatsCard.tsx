import { TrendingUp, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatsCardProps {
  completed: number;
  total: number;
  percentage: number;
  date: Date;
}

export const StatsCard = ({ completed, total, percentage, date }: StatsCardProps) => {
  const isToday = date.toDateString() === new Date().toDateString();
  
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/20 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          {isToday ? "Today's Progress" : "Daily Progress"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-success" />
            {percentage}%
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {completed} of {total} completed
            </span>
            <span className="font-medium text-primary">
              {total - completed} remaining
            </span>
          </div>
        </div>

        {percentage === 100 && (
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <p className="text-success font-semibold">🎉 All tasks completed!</p>
            <p className="text-success/80 text-sm">Great job, Babes!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};