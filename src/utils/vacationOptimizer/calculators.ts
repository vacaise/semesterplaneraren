
import { addDays, format, differenceInDays } from 'date-fns';
import { formatDateToString, isDayOff } from './helpers';
import { VacationPeriod } from './types';

// Completely rewritten function to accurately count total unique days off
export const calculateTotalDaysOff = (periods: VacationPeriod[], holidays: Date[]) => {
  // Create a Set to track all unique days across all periods
  const uniqueDaysSet = new Set<string>();
  
  // Process each period and add all days within it to the Set
  periods.forEach(period => {
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);
    
    // Iterate through every day in the period
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Format date as string to ensure uniqueness in the Set
      const dateString = formatDateToString(currentDate);
      uniqueDaysSet.add(dateString);
      
      // Move to next day
      currentDate = addDays(currentDate, 1);
    }
  });
  
  // The size of the Set is the count of unique days
  const totalUniqueDays = uniqueDaysSet.size;
  
  // Add debug logging
  console.log(`ACCURATE COUNT: Found ${totalUniqueDays} unique days off in total`);
  console.log(`Days: ${Array.from(uniqueDaysSet).join(', ')}`);
  
  return totalUniqueDays;
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

// Completely rewritten efficiency calculation that returns a precise number
export const calculateEfficiencyRatio = (totalDaysOff: number, vacationDaysUsed: number) => {
  if (vacationDaysUsed <= 0) return 0;
  
  // Calculate with 2 decimal places
  const ratio = totalDaysOff / vacationDaysUsed;
  return parseFloat(ratio.toFixed(2));
};
