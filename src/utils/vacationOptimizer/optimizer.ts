
import { VacationPeriod, OptimizedSchedule, OptimizationMode, PotentialPeriod } from './types';
import { calculateVacationDaysNeeded } from './calculators';
import { isDayOff, isDateInPast } from './dateUtils';
import { determinePeriodType, generatePeriodDescription, overlapsWithAny } from './helpers';
import { addDays, differenceInDays } from 'date-fns';

// Main optimization function
export function optimizeVacation(
  year: number,
  totalVacationDays: number,
  holidays: Date[],
  mode: OptimizationMode | string
): OptimizedSchedule {
  // Filter out holidays that have already passed
  const futureHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Find potential vacation periods with high efficiency
  const potentialPeriods = findAllPotentialPeriods(year, futureHolidays);
  
  // Sort periods by mode and efficiency
  const sortedPeriods = sortPeriodsByModeAndEfficiency(potentialPeriods, mode as OptimizationMode);
  
  // Select the optimal periods based on available vacation days
  const selectedPeriods = selectOptimalPeriods(sortedPeriods, totalVacationDays, mode as OptimizationMode, futureHolidays, year);
  
  // Format and return the optimized schedule
  const totalDaysOff = selectedPeriods.reduce((sum, period) => sum + period.days, 0);
  
  return {
    totalDaysOff,
    vacationDaysUsed: totalVacationDays, // Always use exactly this many days
    mode,
    periods: selectedPeriods
  };
}

// Find all potential vacation periods with high efficiency
function findAllPotentialPeriods(
  year: number, 
  holidays: Date[]
): PotentialPeriod[] {
  const potentialPeriods: PotentialPeriod[] = [];
  const today = new Date();
  
  // Current year until December 31
  const startDate = isDateInPast(new Date(year, 0, 1)) 
    ? new Date(Math.max(today.getTime(), new Date(year, 0, 1).getTime()))
    : new Date(year, 0, 1);
    
  const endDate = new Date(year, 11, 31);
  
  // 1. Find periods around holidays
  holidays.forEach(holiday => {
    if (isDateInPast(holiday)) return;
    
    // Look for periods extending before and after the holiday
    for (let daysBeforeHoliday = 0; daysBeforeHoliday <= 7; daysBeforeHoliday++) {
      for (let daysAfterHoliday = 0; daysAfterHoliday <= 7; daysAfterHoliday++) {
        if (daysBeforeHoliday === 0 && daysAfterHoliday === 0) continue; // Skip just the holiday itself
        
        const periodStart = addDays(holiday, -daysBeforeHoliday);
        const periodEnd = addDays(holiday, daysAfterHoliday);
        
        // Skip if start is in the past
        if (isDateInPast(periodStart)) continue;
        
        // Calculate vacation days needed
        const vacationDaysNeeded = calculateVacationDaysNeeded(periodStart, periodEnd, holidays);
        
        // Skip if no vacation days needed (already all holidays/weekends) or more than 10 days needed
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
            description: generatePeriodDescription(periodStart, periodEnd)
          });
        }
      }
    }
  });

  // 2. Find weekend extension periods
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Thursday (extend weekend by taking Friday off)
    if (dayOfWeek === 4) {
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
            description: `Långhelg i ${getMonthNameHelper(thursdayDate.getMonth())}`
          });
        }
      }
    }
    
    // Monday (extend weekend by taking Monday off)
    if (dayOfWeek === 1) {
      const mondayDate = new Date(currentDate);
      const fridayDate = addDays(mondayDate, -3);
      
      // If Monday isn't already a holiday and it's not in the past
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
            description: `Långhelg i ${getMonthNameHelper(fridayDate.getMonth())}`
          });
        }
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // 3. Find traditional vacation periods (summer, etc.)
  const summerMonths = [5, 6, 7]; // June, July, August
  
  summerMonths.forEach(month => {
    // Skip if the entire month is in the past
    if (today.getFullYear() > year || (today.getFullYear() === year && today.getMonth() > month)) {
      return;
    }
    
    for (let weekStartDay = 1; weekStartDay <= 22; weekStartDay += 7) {
      const startDate = new Date(year, month, weekStartDay);
      
      // Skip if in the past
      if (isDateInPast(startDate)) continue;
      
      // Find start of week (Monday)
      const adjustedStartDate = new Date(startDate);
      while (adjustedStartDate.getDay() !== 1) {
        adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
      }
      
      // Create options for 1, 2, and 3-week vacations
      [6, 13, 20].forEach(daysToAdd => {
        const endDate = addDays(adjustedStartDate, daysToAdd);
        const vacationDaysNeeded = calculateVacationDaysNeeded(adjustedStartDate, endDate, holidays);
        
        // Skip if no vacation days needed or more than 15 days needed
        if (vacationDaysNeeded === 0 || vacationDaysNeeded > 15) return;
        
        const totalDays = daysToAdd + 1;
        const efficiency = totalDays / vacationDaysNeeded;
        
        if (efficiency >= 1.3) {
          potentialPeriods.push({
            start: adjustedStartDate,
            end: endDate,
            vacationDaysNeeded,
            totalDays,
            efficiency,
            description: `Sommarsemester i ${getMonthNameHelper(adjustedStartDate.getMonth())}`
          });
        }
      });
    }
  });
  
  return potentialPeriods;
}

// Sort periods by mode and efficiency
function sortPeriodsByModeAndEfficiency(
  periods: PotentialPeriod[],
  mode: OptimizationMode
): PotentialPeriod[] {
  const sortedPeriods = [...periods];
  
  // Sort based on mode preference
  switch (mode) {
    case "longweekends":
      // Prioritize short periods (1-4 days)
      return sortedPeriods.sort((a, b) => {
        if (a.totalDays <= 4 && b.totalDays > 4) return -1;
        if (a.totalDays > 4 && b.totalDays <= 4) return 1;
        // If both are the same type, sort by efficiency
        return b.efficiency - a.efficiency;
      });
      
    case "minibreaks":
      // Prioritize medium periods (5-6 days)
      return sortedPeriods.sort((a, b) => {
        if ((a.totalDays === 5 || a.totalDays === 6) && (b.totalDays < 5 || b.totalDays > 6)) return -1;
        if ((b.totalDays === 5 || b.totalDays === 6) && (a.totalDays < 5 || a.totalDays > 6)) return 1;
        // If both are the same type, sort by efficiency
        return b.efficiency - a.efficiency;
      });
      
    case "weeks":
      // Prioritize week-long periods (7-9 days)
      return sortedPeriods.sort((a, b) => {
        if (a.totalDays >= 7 && a.totalDays <= 9 && (b.totalDays < 7 || b.totalDays > 9)) return -1;
        if (b.totalDays >= 7 && b.totalDays <= 9 && (a.totalDays < 7 || a.totalDays > 9)) return 1;
        // If both are the same type, sort by efficiency
        return b.efficiency - a.efficiency;
      });
      
    case "extended":
      // Prioritize extended periods (10+ days)
      return sortedPeriods.sort((a, b) => {
        if (a.totalDays >= 10 && b.totalDays < 10) return -1;
        if (a.totalDays < 10 && b.totalDays >= 10) return 1;
        // If both are the same type, sort by efficiency
        return b.efficiency - a.efficiency;
      });
      
    case "balanced":
    default:
      // Default to sorting by efficiency
      return sortedPeriods.sort((a, b) => b.efficiency - a.efficiency);
  }
}

// Select optimal periods based on available vacation days
function selectOptimalPeriods(
  sortedPeriods: PotentialPeriod[],
  totalVacationDays: number,
  mode: OptimizationMode,
  holidays: Date[],
  year: number
): VacationPeriod[] {
  let remainingVacationDays = totalVacationDays;
  const selectedPeriods: VacationPeriod[] = [];
  
  // First pass: select highest efficiency periods that match the mode
  for (const period of sortedPeriods) {
    // Skip if period overlaps with already selected periods
    if (overlapsWithAny(period.start, period.end, selectedPeriods)) {
      continue;
    }
    
    // Skip if not enough vacation days left
    if (period.vacationDaysNeeded > remainingVacationDays) {
      continue;
    }
    
    const vacationPeriod: VacationPeriod = {
      start: period.start,
      end: period.end,
      days: period.totalDays,
      vacationDaysNeeded: period.vacationDaysNeeded,
      description: period.description,
      type: determinePeriodType(period.totalDays),
      startDate: period.start.toISOString(),
      endDate: period.end.toISOString()
    };
    
    selectedPeriods.push(vacationPeriod);
    remainingVacationDays -= period.vacationDaysNeeded;
    
    // Break if we've used all vacation days
    if (remainingVacationDays === 0) {
      break;
    }
  }
  
  // If we still have vacation days left, try to distribute them
  // by creating single-day vacations with decent efficiency
  if (remainingVacationDays > 0) {
    distributeRemainingDays(
      remainingVacationDays,
      selectedPeriods,
      holidays,
      year
    );
  }
  
  // Sort periods chronologically
  return selectedPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Distribute remaining vacation days optimally
function distributeRemainingDays(
  remainingDays: number,
  selectedPeriods: VacationPeriod[],
  holidays: Date[],
  year: number
): void {
  // Try to add days near weekends and holidays for maximum efficiency
  // Priority order for months (summer first, then spring/fall, then winter)
  const months = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 0]; // Jul, Aug, Jun, Sep, May, Oct, Apr, Nov, Mar, Dec, Feb, Jan
  const today = new Date();
  
  for (const month of months) {
    if (remainingDays === 0) break;
    
    // Try each day in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (year === today.getFullYear() && month === today.getMonth()) ? today.getDate() + 1 : 1;
    
    // Try to place days around existing holidays or weekends
    for (let day = startDay; day <= daysInMonth && remainingDays > 0; day++) {
      const currentDate = new Date(year, month, day);
      
      // Skip if it's a weekend, holiday, or already in a selected period
      if (isDayOff(currentDate, holidays) || 
          overlapsWithAny(currentDate, currentDate, selectedPeriods)) {
        continue;
      }
      
      // Check if taking this day off would create a "bridge" to a weekend or holiday
      let shouldTakeOff = false;
      
      // Check day before
      const dayBefore = addDays(currentDate, -1);
      if (isDayOff(dayBefore, holidays)) {
        shouldTakeOff = true;
      }
      
      // Check day after
      const dayAfter = addDays(currentDate, 1);
      if (isDayOff(dayAfter, holidays)) {
        shouldTakeOff = true;
      }
      
      // Check two days before (for potential 4-day weekend)
      const twoDaysBefore = addDays(currentDate, -2);
      if (isDayOff(twoDaysBefore, holidays) && isDayOff(dayBefore, holidays)) {
        shouldTakeOff = true;
      }
      
      // Check two days after (for potential 4-day weekend)
      const twoDaysAfter = addDays(currentDate, 2);
      if (isDayOff(dayAfter, holidays) && isDayOff(twoDaysAfter, holidays)) {
        shouldTakeOff = true;
      }
      
      if (shouldTakeOff) {
        // Calculate total days in the period
        let periodStart = new Date(currentDate);
        let periodEnd = new Date(currentDate);
        
        // Expand backward until we hit a workday
        while (periodStart.getDay() !== 1) { // Keep going until we hit a Monday
          const prevDay = addDays(periodStart, -1);
          if (isDayOff(prevDay, holidays) || overlapsWithAny(prevDay, prevDay, selectedPeriods)) {
            periodStart = prevDay;
          } else {
            break;
          }
        }
        
        // Expand forward until we hit a workday
        while (periodEnd.getDay() !== 5) { // Keep going until we hit a Friday
          const nextDay = addDays(periodEnd, 1);
          if (isDayOff(nextDay, holidays) || overlapsWithAny(nextDay, nextDay, selectedPeriods)) {
            periodEnd = nextDay;
          } else {
            break;
          }
        }
        
        const totalDays = differenceInDays(periodEnd, periodStart) + 1;
        
        // Add this period
        selectedPeriods.push({
          start: currentDate,
          end: currentDate,
          days: totalDays,
          vacationDaysNeeded: 1,
          description: `Ledig dag i ${getMonthNameHelper(currentDate.getMonth())}`,
          type: "single",
          startDate: currentDate.toISOString(),
          endDate: currentDate.toISOString()
        });
        
        remainingDays--;
      }
    }
  }
  
  // If we still have days left, just add them as standalone days
  if (remainingDays > 0) {
    addStandaloneDays(remainingDays, selectedPeriods, holidays, year);
  }
}

// Add standalone vacation days when no better options exist
function addStandaloneDays(
  remainingDays: number,
  selectedPeriods: VacationPeriod[],
  holidays: Date[],
  year: number
): void {
  const months = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 0]; // Priority order
  const today = new Date();
  
  for (const month of months) {
    if (remainingDays === 0) break;
    
    // Try to place days in this month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (year === today.getFullYear() && month === today.getMonth()) ? today.getDate() + 1 : 1;
    
    for (let day = startDay; day <= daysInMonth && remainingDays > 0; day++) {
      const date = new Date(year, month, day);
      
      // Skip weekends, holidays and dates already in a period
      if (isDayOff(date, holidays) || overlapsWithAny(date, date, selectedPeriods)) {
        continue;
      }
      
      // Create a one-day period
      selectedPeriods.push({
        start: date,
        end: date,
        days: 1, // Just one day off
        vacationDaysNeeded: 1,
        description: `Ledig dag i ${getMonthNameHelper(month)}`,
        type: "single",
        startDate: date.toISOString(),
        endDate: date.toISOString()
      });
      
      remainingDays--;
      if (remainingDays === 0) break;
    }
  }
}

// Helper function to get month name
function getMonthNameHelper(month: number): string {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[month];
}
