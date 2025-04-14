
import React from 'react';
import { ScheduleEvent } from '@/types/schedule';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentEventsProps {
  events: ScheduleEvent[];
}

const RecentEvents: React.FC<RecentEventsProps> = ({ events }) => {
  // Sort events by day and time to get chronological order
  const sortedEvents = [...events].sort((a, b) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  // Take the last 3 events
  const recentEvents = sortedEvents.slice(-3);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-180px)]">
          {recentEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No events yet</p>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="border-l-4 pl-4 py-2" style={{ borderColor: event.color }}>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.day} • {event.startTime} - {event.endTime}</p>
                  <p className="text-sm">{event.description}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentEvents;
