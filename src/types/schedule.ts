
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  color: string;
  trailerId: string;
}
