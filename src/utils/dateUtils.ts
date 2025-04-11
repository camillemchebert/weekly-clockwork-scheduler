
import { DayOfWeek } from "@/types";

export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute} ${period}`;
};

export const formatTimeForInput = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

export const parseTimeString = (timeString: string): { hour: number; minute: number } => {
  const [hourStr, minuteStr] = timeString.split(":");
  return {
    hour: parseInt(hourStr, 10),
    minute: parseInt(minuteStr, 10),
  };
};

export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  
  for (let hour = 7; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      // Stop at 7:00 PM (19:00)
      if (hour === 19 && minute > 0) break;
      
      slots.push(formatTimeForInput(hour, minute));
    }
  }
  
  return slots;
};

export const getTimeSlotLabel = (timeSlot: string): string => {
  const { hour, minute } = parseTimeString(timeSlot);
  return formatTime(hour, minute);
};

export const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  // Calculate the date of Monday of the current week
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  
  // Generate dates for Monday through Friday
  const weekDates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const isOverlapping = (
  startTime1: string,
  endTime1: string,
  startTime2: string,
  endTime2: string
): boolean => {
  return startTime1 < endTime2 && startTime2 < endTime1;
};
