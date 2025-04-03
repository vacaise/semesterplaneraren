import { addDays, differenceInDays, getMonth } from 'date-fns';
import { isDayOff, isDateInPast, getMonthName } from './dateUtils';
import { VacationPeriod } from './types';
import { calculateVacationDaysNeeded } from './calculators';

// Find optimal vacation periods based on holidays
export function findOptimalVacationPeriods(
  year: number, 
  holidays: Date[]
): VacationPeriod[] {
  const allPeriods: VacationPeriod[] = [];
  
  // Filter out past holidays
  const futureHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Sort holidays chronologically
  futureHolidays.sort((a, b) => a.getTime() - b.getTime());
  
  // Find periods around each holiday
  futureHolidays.forEach(holiday => {
    // Look for periods starting up to 5 days before the holiday
    for (let daysBeforeHoliday = 0; daysBeforeHoliday <= 5; daysBeforeHoliday++) {
      const startDate = addDays(holiday, -daysBeforeHoliday);
      
      // Skip if start date is in the past
      if (isDateInPast(startDate)) continue;
      
      // Look for periods ending up to 5 days after the holiday
      for (let daysAfterHoliday = 0; daysAfterHoliday <= 5; daysAfterHoliday++) {
        const endDate = addDays(holiday, daysAfterHoliday);
        
        // Calculate vacation days needed
        const vacationDaysNeeded = calculateVacationDaysNeeded(startDate, endDate, holidays);
        
        // Skip periods that require no vacation days (already all holidays/weekends)
        if (vacationDaysNeeded === 0) continue;
        
        // Calculate total days in the period
        const totalDays = differenceInDays(endDate, startDate) + 1;
        
        // Calculate efficiency ratio (days off per vacation day)
        const efficiency = totalDays / vacationDaysNeeded;
        
        // Only consider periods with good efficiency
        if (efficiency >= 1.3) {
          const description = generatePeriodDescription(startDate, endDate);
          
          allPeriods.push({
            start: startDate,
            end: endDate,
            days: totalDays,
            vacationDaysNeeded,
            description,
            type: determinePeriodType(totalDays),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          });
        }
      }
    }
  });
  
  // Find weekend extension periods
  allPeriods.push(...findWeekendExtensionPeriods(year, holidays));
  
  // Find traditional vacation periods (summer, etc.)
  allPeriods.push(...findTraditionalVacationPeriods(year, holidays));
  
  // Sort by efficiency (most efficient first)
  return allPeriods.sort((a, b) => {
    const aEfficiency = a.days / a.vacationDaysNeeded;
    const bEfficiency = b.days / b.vacationDaysNeeded;
    return bEfficiency - aEfficiency;
  });
}

// Generate a description for a period
function generatePeriodDescription(startDate: Date, endDate: Date): string {
  const monthStart = getMonth(startDate);
  const monthEnd = getMonth(endDate);
  
  if (monthStart === monthEnd) {
    return `Ledighet i ${getMonthName(monthStart)}`;
  } else {
    return `Ledighet ${getMonthName(monthStart)}-${getMonthName(monthEnd)}`;
  }
}

// Determine the type of period based on its length
function determinePeriodType(totalDays: number): string {
  if (totalDays <= 4) {
    return "longweekend";
  } else if (totalDays <= 6) {
    return "minibreak";
  } else if (totalDays <= 9) {
    return "week";
  } else {
    return "extended";
  }
}

// Find weekend extension periods
function findWeekendExtensionPeriods(
  year: number, 
  holidays: Date[]
): VacationPeriod[] {
  const weekendPeriods: VacationPeriod[] = [];
  
  // Generate all Thursdays and Fridays in the year
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Skip if date is in the past
    if (isDateInPast(currentDate)) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    const dayOfWeek = currentDate.getDay();
    
    // Thursday (extend to Sunday)
    if (dayOfWeek === 4) {
      const thursdayDate = new Date(currentDate);
      const sundayDate = addDays(thursdayDate, 3);
      
      // If Friday isn't a holiday
      if (!isDayOff(addDays(thursdayDate, 1), holidays)) {
        const vacationDaysNeeded = calculateVacationDaysNeeded(thursdayDate, sundayDate, holidays);
        weekendPeriods.push({
          start: thursdayDate,
          end: sundayDate,
          days: 4,
          vacationDaysNeeded,
          description: `Långhelg i ${getMonthName(thursdayDate.getMonth())}`,
          type: "longweekend",
          startDate: thursdayDate.toISOString(),
          endDate: sundayDate.toISOString()
        });
      }
    }
    
    // Monday (extend from Friday)
    if (dayOfWeek === 1) {
      const mondayDate = new Date(currentDate);
      const fridayDate = addDays(mondayDate, -3);
      
      // Skip if in the past
      if (!isDateInPast(fridayDate)) {
        // If Monday isn't a holiday
        if (!isDayOff(mondayDate, holidays)) {
          const vacationDaysNeeded = calculateVacationDaysNeeded(fridayDate, mondayDate, holidays);
          weekendPeriods.push({
            start: fridayDate,
            end: mondayDate,
            days: 4,
            vacationDaysNeeded,
            description: `Långhelg i ${getMonthName(fridayDate.getMonth())}`,
            type: "longweekend",
            startDate: fridayDate.toISOString(),
            endDate: mondayDate.toISOString()
          });
        }
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return weekendPeriods;
}

// Find traditional vacation periods (summer, winter, etc.)
function findTraditionalVacationPeriods(
  year: number, 
  holidays: Date[]
): VacationPeriod[] {
  const regularPeriods: VacationPeriod[] = [];
  
  // Summer vacation options
  const summerMonths = [6, 7]; // July and August
  
  summerMonths.forEach(month => {
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
        const totalDays = daysToAdd + 1;
        
        regularPeriods.push({
          start: adjustedStartDate,
          end: endDate,
          days: totalDays,
          vacationDaysNeeded,
          description: `Sommarsemester i ${getMonthName(adjustedStartDate.getMonth())}`,
          type: totalDays <= 9 ? "week" : "extended",
          startDate: adjustedStartDate.toISOString(),
          endDate: endDate.toISOString()
        });
      });
    }
  });
  
  // Other seasonal vacation options
  const otherMonths = [1, 2, 3, 4, 5, 8, 9, 10, 11]; // Feb-June, Sept-Dec
  
  otherMonths.forEach(month => {
    // Add one week option in the middle of each month
    const startDate = new Date(year, month, 15);
    
    // Skip if in the past
    if (isDateInPast(startDate)) return;
    
    // Find start of week (Monday)
    const adjustedStartDate = new Date(startDate);
    while (adjustedStartDate.getDay() !== 1) {
      adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
    }
    
    const endDate = addDays(adjustedStartDate, 6); // One week
    const vacationDaysNeeded = calculateVacationDaysNeeded(adjustedStartDate, endDate, holidays);
    
    let description = "";
    if (month === 1) description = "Sportlov";
    else if (month === 2 || month === 3) description = "Vårlov";
    else if (month === 9 || month === 10) description = "Höstlov";
    else if (month === 11) description = "Julledighet";
    else description = `Ledighet i ${getMonthName(month)}`;
    
    regularPeriods.push({
      start: adjustedStartDate,
      end: endDate,
      days: 7,
      vacationDaysNeeded,
      description,
      type: "week",
      startDate: adjustedStartDate.toISOString(),
      endDate: endDate.toISOString()
    });
  });
  
  return regularPeriods;
}
