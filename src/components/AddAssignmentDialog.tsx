import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Assignment } from '@/types/habit';

interface AddAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
}

export const AddAssignmentDialog: React.FC<AddAssignmentDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    lastSubmitDate: '',
    priority: 'medium' as const,
    notificationTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.lastSubmitDate) {
      return;
    }

    const assignment: Omit<Assignment, 'id' | 'createdAt'> = {
      ...formData,
      isCompleted: false,
    };

    onAdd(assignment);
    setFormData({
      title: '',
      subject: '',
      description: '',
      lastSubmitDate: '',
      priority: 'medium',
      notificationTime: '',
    });
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Add New Assignment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-card-foreground">Assignment Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter assignment title"
              className="bg-background/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-card-foreground">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Enter subject name"
              className="bg-background/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter assignment description (optional)"
              className="bg-background/50 border-border/50 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastSubmitDate" className="text-card-foreground">Last Submit Date *</Label>
            <Input
              id="lastSubmitDate"
              type="date"
              value={formData.lastSubmitDate}
              onChange={(e) => handleInputChange('lastSubmitDate', e.target.value)}
              className="bg-background/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-card-foreground">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/50">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationTime" className="text-card-foreground">Notification Time</Label>
            <Input
              id="notificationTime"
              type="time"
              value={formData.notificationTime}
              onChange={(e) => handleInputChange('notificationTime', e.target.value)}
              className="bg-background/50 border-border/50"
              placeholder="Set reminder time (optional)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90 transition-all duration-smooth">
              Add Assignment
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};