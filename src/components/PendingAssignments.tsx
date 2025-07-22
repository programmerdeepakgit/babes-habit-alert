import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Assignment } from '@/types/habit';
import { assignmentStorage } from '@/utils/assignmentStorage';
import { useNavigate } from 'react-router-dom';

export const PendingAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPendingAssignments();
  }, []);

  const loadPendingAssignments = () => {
    const pending = assignmentStorage.getPendingAssignments();
    // Sort by deadline (closest first)
    const sorted = pending.sort((a, b) => {
      return new Date(a.lastSubmitDate).getTime() - new Date(b.lastSubmitDate).getTime();
    });
    // Show only first 3 assignments
    setAssignments(sorted.slice(0, 3));
  };

  const getDaysUntilDeadline = (lastSubmitDate: string) => {
    const deadline = new Date(lastSubmitDate);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-destructive text-destructive-foreground';
      case 'medium': return 'bg-gradient-warning text-warning-foreground';
      case 'low': return 'bg-gradient-success text-success-foreground';
      default: return 'bg-gradient-muted text-muted-foreground';
    }
  };

  if (assignments.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg text-card-foreground">Pending Assignments</CardTitle>
            <Badge variant="outline" className="bg-gradient-warning">
              {assignmentStorage.getPendingAssignments().length}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/assignments')}
            className="text-primary hover:text-primary"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.map((assignment) => {
          const daysLeft = getDaysUntilDeadline(assignment.lastSubmitDate);
          const isOverdue = daysLeft < 0;
          const isUrgent = daysLeft <= 2 && daysLeft >= 0;
          
          return (
            <div 
              key={assignment.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 transition-colors duration-smooth cursor-pointer"
              onClick={() => navigate('/assignments')}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-card-foreground truncate">{assignment.title}</h4>
                  <Badge className={getPriorityColor(assignment.priority)}>
                    {assignment.priority}
                  </Badge>
                </div>
                <p className="text-xs text-primary font-medium">{assignment.subject}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(assignment.lastSubmitDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className={isOverdue ? 'text-destructive font-medium' : isUrgent ? 'text-warning font-medium' : ''}>
                      {isOverdue ? `${Math.abs(daysLeft)} days overdue` : 
                       daysLeft === 0 ? 'Due today' :
                       daysLeft === 1 ? 'Due tomorrow' :
                       `${daysLeft} days left`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {assignmentStorage.getPendingAssignments().length > 3 && (
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => navigate('/assignments')}
          >
            View {assignmentStorage.getPendingAssignments().length - 3} More Assignments
          </Button>
        )}
      </CardContent>
    </Card>
  );
};