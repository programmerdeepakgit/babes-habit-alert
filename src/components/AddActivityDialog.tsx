import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddActivityDialogProps {
  onAdd: (time: string, name: string) => void;
}

export const AddActivityDialog = ({ onAdd }: AddActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (time && name.trim()) {
      onAdd(time, name.trim());
      setTime('');
      setName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-gradient-to-r from-primary to-primary-glow hover:shadow-soft">
          <Plus className="w-4 h-4" />
          Add New Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Add New Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="time" className="font-medium">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border-2 focus:border-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">Activity Name</Label>
            <Input
              id="name"
              placeholder="Enter activity name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 focus:border-primary"
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
            >
              Add Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};