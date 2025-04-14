
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleEvent, DayOfWeek } from '@/types/schedule';
import { toast } from "sonner";

interface EventFormProps {
  addEvent: (event: ScheduleEvent) => void;
  editEvent?: ScheduleEvent;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ addEvent, editEvent, onClose }) => {
  const [title, setTitle] = useState(editEvent?.title || '');
  const [description, setDescription] = useState(editEvent?.description || '');
  const [day, setDay] = useState<DayOfWeek>(editEvent?.day || 'Monday');
  const [startTime, setStartTime] = useState(editEvent?.startTime || '09:00');
  const [endTime, setEndTime] = useState(editEvent?.endTime || '10:00');
  const [color, setColor] = useState(editEvent?.color || '#8B5CF6');
  
  const colorOptions = [
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#F97316', label: 'Orange' },
    { value: '#0EA5E9', label: 'Blue' },
    { value: '#22C55E', label: 'Green' },
    { value: '#EF4444', label: 'Red' },
  ];

  const handleDayChange = (value: string) => {
    setDay(value as DayOfWeek);
  };

  const handleColorChange = (value: string) => {
    setColor(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !startTime || !endTime) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (startTime >= endTime) {
      toast.error("Start time must be before end time");
      return;
    }
    
    const newEvent: ScheduleEvent = {
      id: editEvent?.id || crypto.randomUUID(),
      title,
      description,
      day,
      startTime,
      endTime,
      color,
      trailerId: editEvent?.trailerId || '' 
    };
    
    addEvent(newEvent);
    toast.success(editEvent ? "Event updated" : "Event added");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Event title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Event description"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="day">Day</Label>
          <Select defaultValue={day} onValueChange={handleDayChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Tuesday">Tuesday</SelectItem>
              <SelectItem value="Wednesday">Wednesday</SelectItem>
              <SelectItem value="Thursday">Thursday</SelectItem>
              <SelectItem value="Friday">Friday</SelectItem>
              <SelectItem value="Saturday">Saturday</SelectItem>
              <SelectItem value="Sunday">Sunday</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="color">Color</Label>
          <Select defaultValue={color} onValueChange={handleColorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select color">
                <div className="flex items-center">
                  <span className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                  {colorOptions.find(c => c.value === color)?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <span className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: option.value }}></span>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input 
            id="startTime" 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
          />
        </div>
        
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input 
            id="endTime" 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{editEvent ? 'Update' : 'Add'} Event</Button>
      </div>
    </form>
  );
};

export default EventForm;
