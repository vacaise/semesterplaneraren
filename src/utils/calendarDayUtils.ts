
import { isSameDay, isWeekend } from "date-fns";

interface DayTypeInfo {
  className: string;
  type: string;
}

/**
 * Determines if a date falls within any of the provided periods
 */
export const isInPeriod = (date: Date, periods: Array<{ start: Date; end: Date }>) => {
  return periods.some(period => {
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);
    
    // Convert all dates to midnight for correct comparison
    date.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    return date >= startDate && date <= endDate;
  });
};

/**
 * Returns styling and type information for a calendar day
 */
export const getDayType = (
  date: Date, 
  holidays: Date[], 
  periods: Array<{ start: Date; end: Date }>
): DayTypeInfo => {
  const dateToCheck = new Date(date.getTime());
  dateToCheck.setHours(0, 0, 0, 0);
  
  // Röd dag (helgdag)
  if (holidays.some(holiday => {
    const holidayDate = new Date(holiday);
    holidayDate.setHours(0, 0, 0, 0);
    return isSameDay(holidayDate, dateToCheck);
  })) {
    return { className: "bg-red-200 text-red-800", type: "Röd dag" };
  }
  
  // Helg
  if (isWeekend(dateToCheck)) {
    return { className: "bg-orange-100 text-orange-800", type: "Helg" };
  }
  
  // Semesterdag (om inom en period och varken röd dag eller helg)
  if (isInPeriod(dateToCheck, periods)) {
    return { className: "bg-green-200 text-green-800 border-2 border-green-300", type: "Semesterdag" };
  }
  
  // Vardag
  return { className: "", type: "Vardag" };
};
