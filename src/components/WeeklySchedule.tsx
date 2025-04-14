
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScheduleEvent, DayOfWeek } from '@/types/schedule';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EventForm from './EventForm';

interface WeeklyScheduleProps {
  events: ScheduleEvent[];
  onDeleteEvent: (id: string) => void;
  onEditEvent: (event: ScheduleEvent) => void;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ 
  events, 
  onDeleteEvent,
  onEditEvent
}) => {
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const days: DayOfWeek[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8; // Start from 8 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (updatedEvent: ScheduleEvent) => {
    onEditEvent(updatedEvent);
    setIsEditDialogOpen(false);
    setEditingEvent(null);
  };

  const isEventInTimeSlot = (event: ScheduleEvent, timeSlot: string) => {
    const eventStartHour = parseInt(event.startTime.split(':')[0]);
    const timeSlotHour = parseInt(timeSlot.split(':')[0]);
    return eventStartHour === timeSlotHour;
  };

  return (
    <>
      <Card className="overflow-auto">
        <CardContent className="p-4">
          <div className="grid grid-cols-8 gap-4">
            <div className="font-semibold text-gray-500 text-sm">Time</div>
            {days.map(day => (
              <div key={day} className="font-semibold text-center">{day}</div>
            ))}
            
            {timeSlots.map(timeSlot => (
              <React.Fragment key={timeSlot}>
                <div className="text-sm text-gray-500 py-2">{timeSlot}</div>
                
                {days.map(day => {
                  const eventsForSlot = events.filter(
                    event => event.day === day && isEventInTimeSlot(event, timeSlot)
                  );
                  
                  return (
                    <div 
                      key={`${day}-${timeSlot}`} 
                      className="min-h-[60px] border border-gray-200 rounded-md p-1"
                    >
                      {eventsForSlot.map(event => (
                        <div 
                          key={event.id}
                          className="rounded-md p-2 mb-1 text-sm relative"
                          style={{ backgroundColor: event.color, color: '#fff' }}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs opacity-90">
                            {event.startTime} - {event.endTime}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 absolute top-1 right-1 text-white opacity-80 hover:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(event)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onDeleteEvent(event.id)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>Edit Event</DialogTitle>
          {editingEvent && (
            <EventForm 
              addEvent={handleEditSubmit} 
              editEvent={editingEvent}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeeklySchedule;
