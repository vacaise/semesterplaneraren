
import { format, isWeekend } from "date-fns";

// Helper to check if a date is in a collection of dates
// (for example, is the date a holiday from a list of holidays)
const isDateInCollection = (date: Date, collection: Date[] = []): boolean => {
  return collection.some(d =>
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
};

// Checks if a date is in any of the specified vacation periods
const isDateInPeriods = (date: Date, periods: any[] = []): boolean => {
  return periods.some(period => {
    const start = new Date(period.start);
    const end = new Date(period.end);
    
    // Fix the date comparison logic to correctly check if a date falls within a period
    return date >= start && date <= end;
  });
};

// Get the appropriate class and type for each calendar day
export const getDayType = (date: Date, holidays: Date[] = [], periods: any[] = []) => {
  // Check if it's a holiday
  if (isDateInCollection(date, holidays)) {
    return {
      className: "bg-red-200 text-red-800", // Red for holidays
      type: "Röd dag"
    };
  }
  
  // Check if it's a vacation day
  if (isDateInPeriods(date, periods)) {
    return {
      className: "bg-green-200 text-green-800", // Green for vacation days
      type: "Semesterdag"
    };
  }
  
  // Check if it's a weekend
  if (isWeekend(date)) {
    return {
      className: "bg-orange-100 text-orange-800", // Orange for weekends
      type: "Helg"
    };
  }
  
  // Regular weekday
  return {
    className: "bg-gray-50 text-gray-800", // Gray for regular weekdays
    type: "Vardag"
  };
};
