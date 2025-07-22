import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { AddAssignmentDialog } from './AddAssignmentDialog';
import { EditAssignmentDialog } from './EditAssignmentDialog';
import { Assignment } from '@/types/habit';
import { assignmentStorage } from '@/utils/assignmentStorage';
import { useToast } from '@/hooks/use-toast';

export const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    const loadedAssignments = assignmentStorage.getAssignments();
    // Sort by last submit date (closest first) and completion status
    const sorted = loadedAssignments.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return new Date(a.lastSubmitDate).getTime() - new Date(b.lastSubmitDate).getTime();
    });
    setAssignments(sorted);
  };

  const handleAddAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    assignmentStorage.saveAssignment(newAssignment);
    loadAssignments();
    toast({
      title: "Assignment added",
      description: "Your coaching assignment has been added successfully.",
    });
  };

  const handleEditAssignment = (assignment: Assignment) => {
    assignmentStorage.saveAssignment(assignment);
    loadAssignments();
    setEditingAssignment(null);
    toast({
      title: "Assignment updated",
      description: "Your assignment has been updated successfully.",
    });
  };

  const handleCompleteAssignment = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      const updatedAssignment = {
        ...assignment,
        isCompleted: true,
        completedAt: new Date(),
      };
      assignmentStorage.saveAssignment(updatedAssignment);
      loadAssignments();
      toast({
        title: "Assignment completed",
        description: "Great job! Assignment marked as completed.",
      });
    }
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    assignmentStorage.deleteAssignment(assignmentId);
    loadAssignments();
    toast({
      title: "Assignment deleted",
      description: "Assignment has been removed.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-destructive text-destructive-foreground';
      case 'medium': return 'bg-gradient-warning text-warning-foreground';
      case 'low': return 'bg-gradient-success text-success-foreground';
      default: return 'bg-gradient-muted text-muted-foreground';
    }
  };

  const getDaysUntilDeadline = (lastSubmitDate: string) => {
    const deadline = new Date(lastSubmitDate);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pendingAssignments = assignments.filter(a => !a.isCompleted);
  const completedAssignments = assignments.filter(a => a.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Coaching Assignments
            </h1>
            <p className="text-muted-foreground">
              Manage your coaching assignments and deadlines
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-smooth"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Assignment
          </Button>
        </div>

        {/* Pending Assignments */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-card-foreground">Pending Assignments</h2>
            <Badge variant="outline" className="bg-gradient-warning">
              {pendingAssignments.length}
            </Badge>
          </div>
          
          {pendingAssignments.length === 0 ? (
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                <p className="text-muted-foreground">No pending assignments!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingAssignments.map((assignment) => {
                const daysLeft = getDaysUntilDeadline(assignment.lastSubmitDate);
                const isOverdue = daysLeft < 0;
                const isUrgent = daysLeft <= 2 && daysLeft >= 0;
                
                return (
                  <Card key={assignment.id} className="bg-gradient-card border-border/50 hover:shadow-elegant transition-all duration-smooth">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-card-foreground">{assignment.title}</CardTitle>
                          <CardDescription className="text-sm font-medium text-primary">
                            {assignment.subject}
                          </CardDescription>
                        </div>
                        <Badge className={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {assignment.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {assignment.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Due:</span>
                        <span className={isOverdue ? 'text-destructive font-medium' : isUrgent ? 'text-warning font-medium' : 'text-card-foreground'}>
                          {new Date(assignment.lastSubmitDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={isOverdue ? 'text-destructive font-medium' : isUrgent ? 'text-warning font-medium' : 'text-muted-foreground'}>
                          {isOverdue ? `${Math.abs(daysLeft)} days overdue` : 
                           daysLeft === 0 ? 'Due today' :
                           daysLeft === 1 ? 'Due tomorrow' :
                           `${daysLeft} days left`}
                        </span>
                      </div>

                      {assignment.notificationTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Reminder at:</span>
                          <span className="text-primary">{assignment.notificationTime}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleCompleteAssignment(assignment.id)}
                          className="flex-1 bg-gradient-success hover:opacity-90 transition-all duration-smooth"
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Done
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingAssignment(assignment)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Assignments */}
        {completedAssignments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-card-foreground">Completed Assignments</h2>
              <Badge variant="outline" className="bg-gradient-success">
                {completedAssignments.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedAssignments.map((assignment) => (
                <Card key={assignment.id} className="bg-gradient-card border-border/50 opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-card-foreground line-through">
                          {assignment.title}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-primary">
                          {assignment.subject}
                        </CardDescription>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Completed on:</span>
                      <span>{assignment.completedAt ? new Date(assignment.completedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <AddAssignmentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddAssignment}
        />

        {editingAssignment && (
          <EditAssignmentDialog
            assignment={editingAssignment}
            open={!!editingAssignment}
            onOpenChange={(open) => !open && setEditingAssignment(null)}
            onSave={handleEditAssignment}
          />
        )}
      </div>
    </div>
  );
};