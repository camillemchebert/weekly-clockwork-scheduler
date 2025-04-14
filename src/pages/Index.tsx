import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import WeeklySchedule from '@/components/WeeklySchedule';
import EventForm from '@/components/EventForm';
import { ScheduleEvent } from '@/types/schedule';
import RecentEvents from '@/components/RecentEvents';

const Index = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  const handleAddEvent = (event: ScheduleEvent) => {
    const existingEventIndex = events.findIndex(e => e.id === event.id);
    
    if (existingEventIndex !== -1) {
      // Update existing event
      const updatedEvents = [...events];
      updatedEvents[existingEventIndex] = event;
      setEvents(updatedEvents);
    } else {
      // Add new event
      setEvents([...events, event]);
    }
    
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogTitle>Add Event</DialogTitle>
              <EventForm 
                addEvent={handleAddEvent} 
                editEvent={editingEvent || undefined}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingEvent(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left column for recent events */}
          <div className="md:col-span-1">
            <RecentEvents events={events} />
          </div>
          
          {/* Main schedule content */}
          <div className="md:col-span-3">
            <WeeklySchedule 
              events={events}
              onDeleteEvent={handleDeleteEvent}
              onEditEvent={(event) => {
                setEditingEvent(event);
                setIsDialogOpen(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
