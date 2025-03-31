
import { addDays, format, differenceInDays } from 'date-fns';
import { formatDateToString, isDayOff } from './helpers';
import { VacationPeriod } from './types';

// Calculate total days off from all selected periods
export const calculateTotalDaysOff = (periods: VacationPeriod[], holidays: Date[]) => {
  // Use Set to avoid counting days twice
  const allDaysOff = new Set<string>();
  
  // Add all days from all periods
  periods.forEach(period => {
    let currentDay = new Date(period.start);
    const periodEnd = new Date(period.end);
    
    while (currentDay <= periodEnd) {
      // Add date in the format YYYY-MM-DD to avoid counting twice
      allDaysOff.add(formatDateToString(currentDay));
      currentDay = addDays(currentDay, 1);
    }
  });
  
  return allDaysOff.size; // Return number of unique days
};

// Calculate required vacation days for a period
export const calculateVacationDaysNeeded = (start: Date, end: Date, holidays: Date[]) => {
  let vacationDaysNeeded = 0;
  let currentDay = new Date(start);
  
  while (currentDay <= end) {
    // Skip weekends and holidays
    const dayOfWeek = currentDay.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    const isHoliday = holidays.some(holiday => 
      format(holiday, 'yyyy-MM-dd') === format(currentDay, 'yyyy-MM-dd')
    );
    
    if (!isWeekend && !isHoliday) {
      vacationDaysNeeded++;
    }
    
    currentDay = addDays(currentDay, 1);
  }
  
  return vacationDaysNeeded;
};

// Calculate total days in a period
export const calculatePeriodDays = (start: Date, end: Date) => {
  return differenceInDays(end, start) + 1;
};

// Enhanced calculation for efficiency ratio
export const calculateEfficiencyRatio = (totalDaysOff: number, vacationDaysUsed: number) => {
  if (vacationDaysUsed <= 0) return 0;
  return totalDaysOff / vacationDaysUsed;
};
