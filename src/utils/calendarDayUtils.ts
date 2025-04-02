
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
    return date >= startDate && date <= endDate;
  });
};

/**
 * Returns styling and type information for a calendar day
 */
export const getDayType = (
  date: Date, 
  holidays: Date[], 
  companyDays: Date[] = [],
  periods: Array<{ start: Date; end: Date }>
): DayTypeInfo => {
  // Röd dag (helgdag)
  if (holidays.some(holiday => isSameDay(holiday, date))) {
    return { className: "bg-red-200 text-red-800", type: "Röd dag" };
  }
  
  // Klämdag/företagsspecifik ledighet
  if (companyDays.some(companyDay => isSameDay(companyDay, date))) {
    return { className: "bg-purple-200 text-purple-800 border-2 border-purple-300", type: "Klämdag" };
  }
  
  // Helg
  if (isWeekend(date)) {
    return { className: "bg-orange-100 text-orange-800", type: "Helg" };
  }
  
  // Semesterdag (om inom en period och varken röd dag eller helg)
  if (isInPeriod(date, periods)) {
    return { className: "bg-green-200 text-green-800 border-2 border-green-300", type: "Semesterdag" };
  }
  
  // Vardag
  return { className: "", type: "Vardag" };
};
