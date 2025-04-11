
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScheduleEvent, DayOfWeek } from "@/types";
import { DAYS_OF_WEEK, generateTimeSlots, getTimeSlotLabel } from "@/utils/dateUtils";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventFormProps {
  isOpen: boolean;
  event?: ScheduleEvent;
  onClose: () => void;
  onSave: (event: ScheduleEvent) => void;
  onDelete?: (eventId: string) => void;
  defaultDay?: DayOfWeek;
  defaultTime?: string;
}

const EVENT_COLORS = [
  { value: "#e0e7ff", label: "Lavender" },
  { value: "#fef3c7", label: "Cream" },
  { value: "#d1fae5", label: "Mint" },
  { value: "#fee2e2", label: "Light Red" },
  { value: "#dbeafe", label: "Light Blue" },
];

const EventForm = ({ 
  isOpen, 
  event, 
  onClose, 
  onSave,
  onDelete,
  defaultDay = 0,
  defaultTime = "09:00",
}: EventFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState<DayOfWeek>(defaultDay);
  const [startTime, setStartTime] = useState(defaultTime);
  const [endTime, setEndTime] = useState("09:15");
  const [color, setColor] = useState(EVENT_COLORS[0].value);
  const [timeSlots] = useState(generateTimeSlots());

  // Initialize form when opened
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Edit mode
        setTitle(event.title);
        setDescription(event.description || "");
        setDay(event.day);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setColor(event.color || EVENT_COLORS[0].value);
      } else {
        // Create mode
        setTitle("");
        setDescription("");
        setDay(defaultDay);
        setStartTime(defaultTime);
        
        // Set end time to 15 minutes after start time
        const [hour, minute] = defaultTime.split(":").map(Number);
        const endMinute = (minute + 15) % 60;
        const endHour = minute + 15 >= 60 ? hour + 1 : hour;
        setEndTime(`${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`);
        
        setColor(EVENT_COLORS[0].value);
      }
    }
  }, [isOpen, event, defaultDay, defaultTime]);

  // Filter end time options to only show times after the start time
  const validEndTimes = timeSlots.filter(time => time > startTime);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }

    const newEvent: ScheduleEvent = {
      id: event?.id || crypto.randomUUID(),
      title,
      description: description.trim() || undefined,
      day,
      startTime,
      endTime,
      color,
    };

    onSave(newEvent);
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription>
            Fill in the details for your schedule event.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your event"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="day">Day</Label>
              <Select value={day.toString()} onValueChange={(value) => setDay(parseInt(value) as DayOfWeek)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a color">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: color }}
                      />
                      {EVENT_COLORS.find(c => c.value === color)?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EVENT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.slice(0, -1).map((time) => (
                    <SelectItem key={time} value={time}>
                      {getTimeSlotLabel(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {validEndTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {getTimeSlotLabel(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          {event && onDelete && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="mr-auto"
            >
              Delete
            </Button>
          )}
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
