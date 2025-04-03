
import { addDays, differenceInDays } from 'date-fns';
import { isDayOff } from '../helpers';
import { VacationPeriod } from '../types';
import { calculateVacationDaysNeeded } from '../calculators';

// Helper: Create a period with calculated vacation days and total days
export function createPeriod(
  start: Date, 
  end: Date, 
  holidays: Date[],
  description: string,
  type: string
): VacationPeriod {
  const vacationDaysNeeded = calculateVacationDaysNeeded(start, end, holidays);
  const totalDays = differenceInDays(end, start) + 1;
  
  return {
    start: new Date(start),
    end: new Date(end),
    days: totalDays,
    vacationDaysNeeded,
    description,
    type,
    score: 0 // Default score, will be adjusted by scoring system
  };
}

// Helper: Find a specific weekday in a month
export function findDayInMonth(year: number, month: number, weekNumber: number, targetDay: number): Date {
  // Start with the first day of the month
  const firstDay = new Date(year, month, 1);
  let dayOffset = targetDay - firstDay.getDay();
  
  // Adjust if negative
  if (dayOffset < 0) dayOffset += 7;
  
  // Calculate the date for the first occurrence of the target day
  const firstTargetDay = new Date(year, month, 1 + dayOffset);
  
  // Add weeks to get to the requested week
  const result = new Date(firstTargetDay);
  result.setDate(firstTargetDay.getDate() + (weekNumber - 1) * 7);
  
  return result;
}

// Helper: Get month name
export function getMonthName(monthIndex: number): string {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
}

// Helper: Get holiday name based on date
export function getHolidayName(holiday: Date, year: number): string {
  const month = holiday.getMonth();
  const day = holiday.getDate();
  
  // Common Swedish holidays
  if (month === 0 && day === 1) return "Nyårsdagen";
  if (month === 0 && day === 6) return "Trettondedag jul";
  if (month === 4 && day === 1) return "Första maj";
  if (month === 5 && day === 6) return "Sveriges nationaldag";
  if (month === 11 && day === 24) return "Julafton";
  if (month === 11 && day === 25) return "Juldagen";
  if (month === 11 && day === 26) return "Annandag jul";
  if (month === 11 && day === 31) return "Nyårsafton";
  
  // Default name
  return `Helgdag ${day} ${getMonthName(month)}`;
}
