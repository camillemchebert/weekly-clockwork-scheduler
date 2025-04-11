
export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  day: number; // 0-4 (Monday-Friday)
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string; // Format: "HH:MM" (24-hour)
  color?: string;
  trailerId: string; // Added trailer ID
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4; // Monday to Friday

export interface Trailer {
  id: string;
  name: string;
}
