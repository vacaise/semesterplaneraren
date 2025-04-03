
import { format, isWeekend } from 'date-fns';
import { sv } from 'date-fns/locale';

// Check if a date is a day off (weekend or holiday)
export function isDayOff(date: Date, holidays: Date[] = []): boolean {
  return isWeekend(date) || isHoliday(date, holidays);
}

// Check if a date is a holiday
export function isHoliday(date: Date, holidays: Date[] = []): boolean {
  return holidays.some(holiday => 
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
}

// Check if a date is in the past
export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// Get month name in Swedish
export function getMonthName(month: number): string {
  const date = new Date();
  date.setMonth(month);
  return format(date, 'MMMM', { locale: sv });
}

// Format date range as string
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDate.getDate()}-${endDate.getDate()} ${getMonthName(startDate.getMonth())}`;
  } else {
    return `${startDate.getDate()} ${getMonthName(startDate.getMonth())} - ${endDate.getDate()} ${getMonthName(endDate.getMonth())}`;
  }
}
