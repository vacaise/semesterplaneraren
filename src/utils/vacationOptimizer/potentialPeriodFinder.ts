
import { addDays, differenceInDays } from 'date-fns';
import { PotentialPeriod, OptimizationMode } from './types';
import { isDateInPast, overlapsWithAny } from './helpers';
import { SwedishHoliday, isDayOff, getSwedishMonthName } from '../swedishHolidays';
import { calculateVacationDaysNeeded } from './calculators';

// Find all potential vacation periods with high efficiency
export function findAllPotentialPeriods(
  year: number, 
  holidays: SwedishHoliday[]
): PotentialPeriod[] {
  const potentialPeriods: PotentialPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start date is either today or January 1st of the selected year, whichever is later
  const startDate = isDateInPast(new Date(year, 0, 1)) 
    ? new Date(Math.max(today.getTime(), new Date(year, 0, 1).getTime()))
    : new Date(year, 0, 1);
    
  const endDate = new Date(year, 11, 31);
  
  // Find periods around holidays
  findHolidayPeriods(year, holidays, potentialPeriods);
  
  // Find weekend extension periods
  findWeekendExtensionPeriods(startDate, endDate, holidays, potentialPeriods);
  
  // Find traditional Swedish vacation periods
  findTraditionalVacationPeriods(year, holidays, today, potentialPeriods);
  
  return potentialPeriods;
}

// Find periods around holidays
function findHolidayPeriods(
  year: number,
  holidays: SwedishHoliday[],
  potentialPeriods: PotentialPeriod[]
): void {
  for (const holiday of holidays) {
    if (isDateInPast(holiday.date)) continue;
    
    // Look for periods extending before and after the holiday
    for (let daysBeforeHoliday = 0; daysBeforeHoliday <= 5; daysBeforeHoliday++) {
      for (let daysAfterHoliday = 0; daysAfterHoliday <= 5; daysAfterHoliday++) {
        if (daysBeforeHoliday === 0 && daysAfterHoliday === 0) continue; // Skip just the holiday itself
        
        const periodStart = addDays(holiday.date, -daysBeforeHoliday);
        const periodEnd = addDays(holiday.date, daysAfterHoliday);
        
        // Skip if start is in the past
        if (isDateInPast(periodStart)) continue;
        
        // Calculate vacation days needed
        const vacationDaysNeeded = calculateVacationDaysNeeded(periodStart, periodEnd, holidays);
        
        // Skip if no vacation days needed (already all holidays/weekends) or too many days needed
        if (vacationDaysNeeded === 0 || vacationDaysNeeded > 10) continue;
        
        // Calculate total days in the period
        const totalDays = differenceInDays(periodEnd, periodStart) + 1;
        
        // Calculate efficiency ratio (days off per vacation day)
        const efficiency = totalDays / vacationDaysNeeded;
        
        // Only consider periods with good efficiency
        if (efficiency >= 1.3) {
          potentialPeriods.push({
            start: periodStart,
            end: periodEnd,
            vacationDaysNeeded,
            totalDays,
            efficiency,
            description: `Ledighet kring ${holiday.name}`
          });
        }
      }
    }
  }
}

// Find weekend extension periods (Thursday-Sunday, Friday-Monday)
function findWeekendExtensionPeriods(
  startDate: Date,
  endDate: Date,
  holidays: SwedishHoliday[],
  potentialPeriods: PotentialPeriod[]
): void {
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Thursday (extend weekend by taking Friday off)
    if (dayOfWeek === 4) { // Thursday
      const thursdayDate = new Date(currentDate);
      const sundayDate = addDays(thursdayDate, 3);
      
      // If Friday isn't already a holiday
      const fridayDate = addDays(thursdayDate, 1);
      if (!isDayOff(fridayDate, holidays) && !isDateInPast(fridayDate)) {
        const vacationDaysNeeded = calculateVacationDaysNeeded(thursdayDate, sundayDate, holidays);
        const totalDays = 4;
        const efficiency = totalDays / vacationDaysNeeded;
        
        if (efficiency >= 1.3) {
          potentialPeriods.push({
            start: thursdayDate,
            end: sundayDate,
            vacationDaysNeeded,
            totalDays,
            efficiency,
            description: `Långhelg i ${getSwedishMonthName(thursdayDate.getMonth())}`
          });
        }
      }
    }
    
    // Monday (extend weekend by taking Monday off)
    if (dayOfWeek === 1) { // Monday
      const mondayDate = new Date(currentDate);
      const fridayDate = addDays(mondayDate, -3);
      
      // If Monday isn't already a holiday and dates aren't in the past
      if (!isDayOff(mondayDate, holidays) && !isDateInPast(fridayDate)) {
        const vacationDaysNeeded = calculateVacationDaysNeeded(fridayDate, mondayDate, holidays);
        const totalDays = 4;
        const efficiency = totalDays / vacationDaysNeeded;
        
        if (efficiency >= 1.3) {
          potentialPeriods.push({
            start: fridayDate,
            end: mondayDate,
            vacationDaysNeeded,
            totalDays,
            efficiency,
            description: `Långhelg i ${getSwedishMonthName(fridayDate.getMonth())}`
          });
        }
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

// Find traditional Swedish vacation periods (summer weeks, July, etc.)
function findTraditionalVacationPeriods(
  year: number,
  holidays: SwedishHoliday[],
  today: Date,
  potentialPeriods: PotentialPeriod[]
): void {
  const summerMonths = [5, 6, 7]; // June, July, August
  
  for (const month of summerMonths) {
    // Skip if the entire month is in the past
    if (today.getFullYear() > year || (today.getFullYear() === year && today.getMonth() > month)) {
      continue;
    }
    
    // Create typical Swedish vacation weeks (common to take full weeks in summer)
    for (let weekStartDay = 1; weekStartDay <= 22; weekStartDay += 7) {
      const startDate = new Date(year, month, weekStartDay);
      
      // Skip if in the past
      if (isDateInPast(startDate)) continue;
      
      // Find start of week (Monday)
      const adjustedStartDate = new Date(startDate);
      while (adjustedStartDate.getDay() !== 1) { // 1 is Monday
        adjustedStartDate.setDate(adjustedStartDate.getDate() + (adjustedStartDate.getDay() === 0 ? 1 : 8 - adjustedStartDate.getDay()));
      }
      
      // Create options for 1, 2, 3, and 4-week vacations (Swedish people often take 3-4 weeks)
      for (const weekCount of [1, 2, 3, 4]) {
        const daysToAdd = (weekCount * 7) - 1; // e.g., 6, 13, 20, 27 days
        const endDate = addDays(adjustedStartDate, daysToAdd);
        const vacationDaysNeeded = calculateVacationDaysNeeded(adjustedStartDate, endDate, holidays);
        
        // Skip if no vacation days needed or too many days needed
        if (vacationDaysNeeded === 0) continue;
        
        const totalDays = daysToAdd + 1;
        const efficiency = totalDays / vacationDaysNeeded;
        
        let description = '';
        if (weekCount === 1) {
          description = `En veckas semester i ${getSwedishMonthName(adjustedStartDate.getMonth())}`;
        } else {
          description = `${weekCount} veckors semester i ${getSwedishMonthName(adjustedStartDate.getMonth())}`;
        }
        
        potentialPeriods.push({
          start: adjustedStartDate,
          end: endDate,
          vacationDaysNeeded,
          totalDays,
          efficiency,
          description
        });
      }
    }
    
    // Special case for July - "Industrisemester" (Industrial vacation - many Swedes take all of July off)
    if (month === 6 && !isDateInPast(new Date(year, 6, 1))) {
      const julyStart = new Date(year, 6, 1);
      const julyEnd = new Date(year, 6, 31);
      
      // Find closest Monday to July 1st
      const adjustedJulyStart = new Date(julyStart);
      while (adjustedJulyStart.getDay() !== 1) { // 1 is Monday
        adjustedJulyStart.setDate(adjustedJulyStart.getDate() - 1);
      }
      
      // Find closest Friday/Sunday to July 31st
      const adjustedJulyEnd = new Date(julyEnd);
      while (adjustedJulyEnd.getDay() !== 0) { // 0 is Sunday
        adjustedJulyEnd.setDate(adjustedJulyEnd.getDate() + 1);
      }
      
      const vacationDaysNeeded = calculateVacationDaysNeeded(adjustedJulyStart, adjustedJulyEnd, holidays);
      const totalDays = differenceInDays(adjustedJulyEnd, adjustedJulyStart) + 1;
      const efficiency = totalDays / vacationDaysNeeded;
      
      potentialPeriods.push({
        start: adjustedJulyStart,
        end: adjustedJulyEnd,
        vacationDaysNeeded,
        totalDays,
        efficiency,
        description: "Industrisemester (hela juli)"
      });
    }
  }
}
