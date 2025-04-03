
import { addDays, endOfYear, format, startOfYear } from 'date-fns';
import { VacationPeriod } from './types';
import { calculateVacationDaysNeeded, calculatePeriodDays } from './calculators';
import { isDayOff } from './helpers';

// Main function to find potential vacation periods
export const findPotentialPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const allPeriods: VacationPeriod[] = [];
  
  // First scan: Find potential periods around holidays
  const holidayPeriods = findPeriodsAroundHolidays(year, holidays);
  allPeriods.push(...holidayPeriods);
  
  // Second scan: Find weekend extensions
  const weekendPeriods = findExtendedWeekends(year, holidays);
  allPeriods.push(...weekendPeriods);
  
  // Third scan: Find bridge day periods
  const bridgeDayPeriods = findBridgeDays(year, holidays);
  allPeriods.push(...bridgeDayPeriods);
  
  // Fourth scan: Add summer options for longer continuous vacations
  const summerPeriods = findSummerPeriods(year, holidays);
  allPeriods.push(...summerPeriods);

  // Calculate and log efficiency for each period
  allPeriods.forEach(period => {
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    period.efficiency = efficiency;
    console.log(`Period ${format(period.start, 'yyyy-MM-dd')} to ${format(period.end, 'yyyy-MM-dd')}: ${period.days} days off for ${period.vacationDaysNeeded} vacation days (${efficiency.toFixed(2)}x efficiency)`);
  });
  
  return allPeriods;
};

// Find periods around holidays
const findPeriodsAroundHolidays = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  for (const holiday of holidays) {
    // Skip if holiday is a weekend
    const holidayDay = holiday.getDay();
    if (holidayDay === 0 || holidayDay === 6) continue;
    
    // Search in both directions from the holiday
    const maxDaysToCheck = 4; // Look up to 4 days in each direction
    
    // Try different period lengths
    for (let daysBeforeHoliday = 0; daysBeforeHoliday <= maxDaysToCheck; daysBeforeHoliday++) {
      for (let daysAfterHoliday = 0; daysAfterHoliday <= maxDaysToCheck; daysAfterHoliday++) {
        // Skip if both are 0
        if (daysBeforeHoliday === 0 && daysAfterHoliday === 0) continue;
        
        const startDate = addDays(holiday, -daysBeforeHoliday);
        const endDate = addDays(holiday, daysAfterHoliday);
        
        // Calculate vacation days needed for this period
        const vacationDaysNeeded = calculateVacationDaysNeeded(startDate, endDate, holidays);
        
        // Skip if no vacation days needed (already a holiday period)
        if (vacationDaysNeeded === 0) continue;
        
        // Calculate total days in period
        const totalDays = calculatePeriodDays(startDate, endDate);
        
        // Calculate efficiency
        const efficiency = totalDays / vacationDaysNeeded;
        
        // Only consider periods with good efficiency
        if (efficiency >= 1.3) {
          const period: VacationPeriod = {
            start: startDate,
            end: endDate,
            days: totalDays,
            vacationDaysNeeded,
            description: `Ledig kring ${format(holiday, 'dd MMM')}`, 
            type: "holiday",
            score: 80 + (efficiency * 10),
            efficiency
          };
          
          periods.push(period);
        }
      }
    }
  }
  
  return periods;
};

// Find extended weekends (Thursday-Sunday or Friday-Monday)
const findExtendedWeekends = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const startOfYearDate = startOfYear(new Date(year, 0, 1));
  const endOfYearDate = endOfYear(new Date(year, 11, 31));
  let currentDate = startOfYearDate;
  
  while (currentDate <= endOfYearDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Look for Thursdays or Fridays
    if (dayOfWeek === 4 || dayOfWeek === 5) {
      const isThursday = dayOfWeek === 4;
      
      // Start period on Thursday or Friday
      const periodStart = new Date(currentDate);
      
      // End period on Sunday or Monday
      const daysToAdd = isThursday ? 3 : 3; // Thursday to Sunday or Friday to Monday
      const periodEnd = addDays(currentDate, daysToAdd);
      
      // Calculate vacation days needed
      const vacationDaysNeeded = calculateVacationDaysNeeded(periodStart, periodEnd, holidays);
      
      // Skip if no vacation days needed or more than 2
      if (vacationDaysNeeded === 0 || vacationDaysNeeded > 2) {
        currentDate = addDays(currentDate, 1);
        continue;
      }
      
      // Calculate total days and efficiency
      const totalDays = calculatePeriodDays(periodStart, periodEnd);
      const efficiency = totalDays / vacationDaysNeeded;
      
      // Only consider periods with good efficiency
      if (efficiency >= 1.5) {
        const period: VacationPeriod = {
          start: periodStart,
          end: periodEnd,
          days: totalDays,
          vacationDaysNeeded,
          description: isThursday ? "Långhelg tors-sön" : "Långhelg fre-mån",
          type: "weekend",
          score: 60 + (efficiency * 5),
          efficiency
        };
        
        periods.push(period);
      }
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  return periods;
};

// Find bridge days between holidays and weekends
const findBridgeDays = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const startOfYearDate = startOfYear(new Date(year, 0, 1));
  const endOfYearDate = endOfYear(new Date(year, 11, 31));
  let currentDate = startOfYearDate;
  
  while (currentDate <= endOfYearDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Look for Tuesday or Thursday - potential bridge days
    if (dayOfWeek === 2 || dayOfWeek === 4) {
      const isTuesday = dayOfWeek === 2;
      
      // Check if the previous or next day is a holiday
      const adjacentDay = isTuesday ? addDays(currentDate, -1) : addDays(currentDate, 1);
      const isAdjacentDayHoliday = holidays.some(holiday => 
        holiday.getFullYear() === adjacentDay.getFullYear() &&
        holiday.getMonth() === adjacentDay.getMonth() &&
        holiday.getDate() === adjacentDay.getDate()
      );
      
      if (isAdjacentDayHoliday) {
        // This is a bridge day opportunity
        let periodStart, periodEnd;
        
        if (isTuesday) {
          // Monday is a holiday, include weekend before
          periodStart = addDays(currentDate, -3); // Saturday
          periodEnd = currentDate; // Tuesday
        } else {
          // Friday is a holiday, include weekend after
          periodStart = currentDate; // Thursday
          periodEnd = addDays(currentDate, 3); // Sunday
        }
        
        // Calculate vacation days needed
        const vacationDaysNeeded = calculateVacationDaysNeeded(periodStart, periodEnd, holidays);
        
        // Calculate total days and efficiency
        const totalDays = calculatePeriodDays(periodStart, periodEnd);
        const efficiency = totalDays / vacationDaysNeeded;
        
        const period: VacationPeriod = {
          start: periodStart,
          end: periodEnd,
          days: totalDays,
          vacationDaysNeeded,
          description: isTuesday ? "Klämdag (tisdag)" : "Klämdag (torsdag)",
          type: "bridge",
          score: 75 + (efficiency * 5),
          efficiency
        };
        
        periods.push(period);
      }
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  return periods;
};

// Find continuous summer vacation options
const findSummerPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Define summer months (June, July, August)
  for (let month = 5; month <= 7; month++) {
    // Create 1-week, 2-week, and 3-week options starting each Monday
    const firstDayOfMonth = new Date(year, month, 1);
    let currentDate = firstDayOfMonth;
    
    // Find first Monday of the month
    while (currentDate.getDay() !== 1) {
      currentDate = addDays(currentDate, 1);
    }
    
    // Create periods starting each Monday of the month
    while (currentDate.getMonth() === month) {
      // 1-week option
      const oneWeekEnd = addDays(currentDate, 6);
      
      // 2-week option
      const twoWeekEnd = addDays(currentDate, 13);
      
      // 3-week option
      const threeWeekEnd = addDays(currentDate, 20);
      
      for (const [endDate, weeks] of [[oneWeekEnd, 1], [twoWeekEnd, 2], [threeWeekEnd, 3]]) {
        const vacationDaysNeeded = calculateVacationDaysNeeded(currentDate, endDate, holidays);
        const totalDays = calculatePeriodDays(currentDate, endDate);
        const efficiency = totalDays / vacationDaysNeeded;
        
        const monthNames = ["januari", "februari", "mars", "april", "maj", "juni", 
                          "juli", "augusti", "september", "oktober", "november", "december"];
        
        const period: VacationPeriod = {
          start: currentDate,
          end: endDate,
          days: totalDays,
          vacationDaysNeeded,
          description: `${weeks} veckor i ${monthNames[month]}`,
          type: "summer",
          score: 70 + (weeks * 5),
          efficiency
        };
        
        periods.push(period);
      }
      
      // Move to next Monday
      currentDate = addDays(currentDate, 7);
    }
  }
  
  return periods;
};

// Export individual finder functions for testing/reuse
export {
  findPeriodsAroundHolidays,
  findExtendedWeekends,
  findBridgeDays,
  findSummerPeriods
};
