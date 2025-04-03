import { isSameDay } from 'date-fns';

// Types of calendar days
export type DayType = 'normal' | 'holiday' | 'weekend' | 'vacation' | 'past';

// Determine the type of a calendar day
export const getDayType = (
  date: Date,
  holidays: Date[],
  vacationPeriods: { start: Date, end: Date }[]
): DayType => {
  // Check if the date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return 'past';
  
  // Check if it's a weekend (Saturday or Sunday)
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';
  
  // Check if it's a holiday
  if (holidays.some(holiday => isSameDay(date, new Date(holiday)))) return 'holiday';
  
  // Check if it's a vacation day
  if (vacationPeriods.some(period => {
    const start = new Date(period.start);
    const end = new Date(period.end);
    return date >= start && date <= end;
  })) return 'vacation';
  
  // Otherwise it's a normal workday
  return 'normal';
};
