
import { useState, useEffect } from "react";
import { ScheduleEvent, DayOfWeek } from "@/types";
import { 
  DAYS_OF_WEEK, 
  generateTimeSlots, 
  getTimeSlotLabel, 
  getCurrentWeekDates, 
  formatDate,
  isOverlapping
} from "@/utils/dateUtils";
import TimeSlot from "./TimeSlot";
import EventForm from "./EventForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WeeklyScheduler = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [timeSlots] = useState(generateTimeSlots());
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates());
  const [weekOffset, setWeekOffset] = useState(0);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | undefined>(undefined);
  const [defaultDay, setDefaultDay] = useState<DayOfWeek>(0);
  const [defaultTime, setDefaultTime] = useState("09:00");
  
  const { toast } = useToast();

  // Time labels on the left side (e.g., 7:00 AM, 7:15 AM)
  const timeLabels = timeSlots.map(slot => {
    // Only show labels for whole and half hours
    const [hour, minute] = slot.split(":").map(Number);
    if (minute === 0 || minute === 30) {
      return { time: slot, label: getTimeSlotLabel(slot) };
    }
    return { time: slot, label: "" };
  });

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("scheduler-events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("scheduler-events", JSON.stringify(events));
  }, [events]);

  // Update week dates when week offset changes
  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    // Calculate the date of Monday of the current week
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));
    
    // Generate dates for Monday through Friday
    const newWeekDates: Date[] = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      newWeekDates.push(date);
    }
    
    setWeekDates(newWeekDates);
  }, [weekOffset]);

  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  const handleCurrentWeek = () => {
    setWeekOffset(0);
  };

  const handleAddEvent = (day: DayOfWeek, time: string) => {
    setDefaultDay(day);
    setDefaultTime(time);
    setSelectedEvent(undefined);
    setIsEventFormOpen(true);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  const handleSaveEvent = (event: ScheduleEvent) => {
    // Check for overlaps with existing events (except the current event being edited)
    const overlappingEvent = events.find(e => 
      e.id !== event.id && 
      e.day === event.day && 
      isOverlapping(e.startTime, e.endTime, event.startTime, event.endTime)
    );
    
    if (overlappingEvent) {
      toast({
        title: "Time conflict",
        description: `This event overlaps with "${overlappingEvent.title}"`,
        variant: "destructive"
      });
      return;
    }
    
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(e => e.id === event.id ? event : e));
      toast({
        title: "Event updated",
        description: `"${event.title}" has been updated.`
      });
    } else {
      // Add new event
      setEvents([...events, event]);
      toast({
        title: "Event added",
        description: `"${event.title}" has been added to your schedule.`
      });
    }
    
    setIsEventFormOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setIsEventFormOpen(false);
    toast({
      title: "Event deleted",
      description: "The event has been removed from your schedule."
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with week navigation */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousWeek}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCurrentWeek}
            aria-label="Current week"
          >
            Today
          </Button>
        </div>
        <h2 className="text-lg font-semibold">
          {formatDate(weekDates[0])} - {formatDate(weekDates[4])}
        </h2>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col flex-1 overflow-hidden border rounded-md">
        {/* Day headers */}
        <div className="flex border-b">
          <div className="w-20 min-w-[5rem] border-r bg-scheduler-highlight/20"></div>
          {DAYS_OF_WEEK.map((day, index) => (
            <div
              key={day}
              className="flex-1 py-2 text-center font-medium border-r last:border-r-0 bg-scheduler-highlight/20"
            >
              <div>{day}</div>
              <div className="text-sm text-gray-500">{formatDate(weekDates[index])}</div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex flex-1 overflow-auto">
          {/* Time labels */}
          <div className="w-20 min-w-[5rem] flex flex-col border-r bg-scheduler-highlight/10">
            {timeLabels.map(({ time, label }) => (
              <div key={time} className="h-6 text-right pr-2 text-xs text-gray-500 relative">
                {label && (
                  <span className="absolute -top-2 right-2">{label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {[0, 1, 2, 3, 4].map((day) => (
            <div key={day} className="flex-1 border-r last:border-r-0">
              {timeSlots.map((time, timeIndex) => (
                <TimeSlot
                  key={`${day}-${time}`}
                  time={time}
                  day={day as DayOfWeek}
                  events={events}
                  onAddEvent={handleAddEvent}
                  onEventClick={handleEventClick}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Event form dialog */}
      <EventForm
        isOpen={isEventFormOpen}
        event={selectedEvent}
        onClose={() => setIsEventFormOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        defaultDay={defaultDay}
        defaultTime={defaultTime}
      />
    </div>
  );
};

export default WeeklyScheduler;
