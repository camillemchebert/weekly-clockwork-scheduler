import { useState, useEffect } from "react";
import { ScheduleEvent, DayOfWeek, Trailer } from "@/types";
import { 
  DAYS_OF_WEEK, 
  generateTimeSlots, 
  getTimeSlotLabel, 
  getCurrentWeekDates, 
  formatDate,
  isOverlapping
} from "@/utils/dateUtils";
import { TRAILERS } from "@/utils/trailerUtils";
import TimeSlot from "./TimeSlot";
import EventForm from "./EventForm";
import TrailerSelector from "./TrailerSelector";
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
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer>(TRAILERS[0]);
  
  const { toast } = useToast();

  const timeLabels = timeSlots.map(slot => {
    const [hour, minute] = slot.split(":").map(Number);
    if (minute === 0 || minute === 30) {
      return { time: slot, label: getTimeSlotLabel(slot) };
    }
    return { time: slot, label: "" };
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem("scheduler-events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scheduler-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));
    
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
    const eventWithTrailer = {
      ...event,
      trailerId: selectedTrailer.id
    };
    
    const overlappingEvent = events.find(e => 
      e.id !== event.id && 
      e.day === event.day && 
      e.trailerId === selectedTrailer.id &&
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
      setEvents(events.map(e => e.id === event.id ? eventWithTrailer : e));
      toast({
        title: "Event updated",
        description: `"${event.title}" has been updated.`
      });
    } else {
      setEvents([...events, eventWithTrailer]);
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

  const handleTrailerChange = (trailer: Trailer) => {
    setSelectedTrailer(trailer);
  };

  const filteredEvents = events.filter(event => event.trailerId === selectedTrailer.id);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 px-2 space-y-4 md:space-y-0">
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
        
        <TrailerSelector 
          selectedTrailer={selectedTrailer}
          onTrailerChange={handleTrailerChange}
        />
        
        <h2 className="text-lg font-semibold">
          {formatDate(weekDates[0])} - {formatDate(weekDates[4])}
        </h2>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden border rounded-md">
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

        <div className="flex flex-1 overflow-auto">
          <div className="w-20 min-w-[5rem] flex flex-col border-r bg-scheduler-highlight/10">
            {timeLabels.map(({ time, label }) => (
              <div key={time} className="h-6 text-right pr-2 text-xs text-gray-500 relative">
                {label && (
                  <span className="absolute -top-2 right-2">{label}</span>
                )}
              </div>
            ))}
          </div>

          {[0, 1, 2, 3, 4].map((day) => (
            <div key={day} className="flex-1 border-r last:border-r-0">
              {timeSlots.map((time, timeIndex) => (
                <TimeSlot
                  key={`${day}-${time}`}
                  time={time}
                  day={day as DayOfWeek}
                  events={filteredEvents}
                  onAddEvent={handleAddEvent}
                  onEventClick={handleEventClick}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

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
