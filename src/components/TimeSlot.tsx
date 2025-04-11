
import { ScheduleEvent } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TimeSlotProps {
  time: string;
  day: number;
  events: ScheduleEvent[];
  onAddEvent: (day: number, time: string) => void;
  onEventClick: (event: ScheduleEvent) => void;
}

const TimeSlot = ({ time, day, events, onAddEvent, onEventClick }: TimeSlotProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Find events that start at this time slot
  const eventsAtThisSlot = events.filter(
    (event) => event.day === day && event.startTime === time
  );
  
  // Check if this time slot contains an event (for styling purposes)
  const isPartOfEvent = events.some(
    (event) =>
      event.day === day &&
      event.startTime <= time &&
      event.endTime > time
  );

  return (
    <div
      className={cn(
        "relative h-6 border-t border-gray-200 group",
        {
          "bg-scheduler-highlight/20": isHovering && !isPartOfEvent,
        }
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => {
        if (!isPartOfEvent) {
          onAddEvent(day, time);
        }
      }}
    >
      {/* Show add button on hover if not part of an event */}
      {isHovering && !isPartOfEvent && (
        <button 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-scheduler-primary text-white rounded-full flex items-center justify-center z-10 opacity-70 hover:opacity-100"
          aria-label="Add event"
        >
          +
        </button>
      )}

      {/* Render events that start at this time slot */}
      {eventsAtThisSlot.map((event) => {
        // Calculate event duration in 15-minute increments
        const startParts = event.startTime.split(":");
        const endParts = event.endTime.split(":");
        const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
        const durationInMinutes = endMinutes - startMinutes;
        const slots = durationInMinutes / 15;
        
        return (
          <div
            key={event.id}
            className={cn(
              "absolute left-0 right-0 z-10 px-2 py-1 rounded-md overflow-hidden cursor-pointer",
              "bg-scheduler-event border border-scheduler-primary/30"
            )}
            style={{
              height: `${slots * 1.5}rem`,
              zIndex: 20,
              backgroundColor: event.color || "#e0e7ff"
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          >
            <h4 className="text-xs font-medium truncate">{event.title}</h4>
            {slots > 1 && (
              <p className="text-xs truncate">{event.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlot;
