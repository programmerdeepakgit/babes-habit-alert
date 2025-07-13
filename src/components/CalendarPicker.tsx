import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CalendarPickerProps {
  selected: Date;
  onSelect: (date: Date) => void;
  className?: string;
}

export const CalendarPicker = ({ selected, onSelect, className }: CalendarPickerProps) => {
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal border-2 hover:border-primary/50",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          <span className="font-medium">
            {isToday(selected) ? 'Today' : format(selected, 'MMM dd, yyyy')}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-lg border-2" align="end">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => date && onSelect(date)}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};