
import { format, isWeekend } from 'date-fns';
import { sv } from 'date-fns/locale';
import { isDayOff, isDateInPast, getMonthName } from './calculators';

// Format date range as string
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDate.getDate()}-${endDate.getDate()} ${getMonthName(startDate.getMonth())}`;
  } else {
    return `${startDate.getDate()} ${getMonthName(startDate.getMonth())} - ${endDate.getDate()} ${getMonthName(endDate.getMonth())}`;
  }
}

// Re-export these functions for backward compatibility
export { isDayOff, isDateInPast, getMonthName };

// Check if a date is a holiday
export function isHoliday(date: Date, holidays: Date[] = []): boolean {
  return holidays.some(holiday => 
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
}
