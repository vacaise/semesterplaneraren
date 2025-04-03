
import { VacationPeriod, OptimizedSchedule, OptimizationMode } from './types';
import { isDayOff, isDateInPast, formatDateToString, getWorkDays } from './helpers';
import { addDays, differenceInDays } from 'date-fns';

// Main export function for optimizing vacation
export const optimizeVacation = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: OptimizationMode
): OptimizedSchedule => {
  console.log(`Optimizing ${vacationDays} vacation days for ${year} with mode: ${mode}`);
  
  // Filter out past holidays
  const activeHolidays = holidays.filter(h => !isDateInPast(h));
  
  // Generate potential periods based on the selected mode
  const periods = generatePotentialPeriods(year, activeHolidays, mode);
  
  // Find the best combination that uses exactly the requested vacation days
  const selectedPeriods = findOptimalCombination(periods, vacationDays);
  
  // Calculate total days off (including weekends and holidays)
  const totalDaysOff = calculateTotalDaysOff(selectedPeriods);
  
  return {
    totalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: selectedPeriods
  };
};

// Generate potential vacation periods based on the optimization mode
function generatePotentialPeriods(year: number, holidays: Date[], mode: OptimizationMode): VacationPeriod[] {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate different types of periods based on optimization mode
  if (mode === 'balanced' || mode === 'extended') {
    // Generate longer periods (1-3 weeks)
    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 21; day += 7) {
        for (let length of [7, 10, 14, 21]) {
          const startDate = new Date(year, month, day);
          if (startDate < today) continue;
          
          const endDate = addDays(startDate, length - 1);
          const vacationDaysNeeded = getWorkDays(startDate, endDate, holidays);
          
          periods.push({
            start: startDate,
            end: endDate,
            days: length,
            vacationDaysNeeded,
            description: `${length} dagars semester`,
            type: length > 10 ? "extended" : "week",
            score: getScoreForPeriod(startDate, endDate, vacationDaysNeeded, holidays, mode)
          });
        }
      }
    }
  }
  
  if (mode === 'balanced' || mode === 'longweekends' || mode === 'minibreaks') {
    // Generate weekend extensions
    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 28; day += 3) {
        // Thursday to Sunday (4 days)
        const thursdayStart = new Date(year, month, day);
        if (thursdayStart.getDay() === 4 && thursdayStart >= today) { // Thursday
          const sundayEnd = addDays(thursdayStart, 3);
          const vacationDaysNeeded = getWorkDays(thursdayStart, sundayEnd, holidays);
          
          periods.push({
            start: thursdayStart,
            end: sundayEnd,
            days: 4,
            vacationDaysNeeded,
            description: `Lång helg ${getMonthName(month)}`,
            type: "longweekend",
            score: getScoreForPeriod(thursdayStart, sundayEnd, vacationDaysNeeded, holidays, mode)
          });
        }
        
        // Friday to Monday (4 days)
        const fridayStart = new Date(year, month, day);
        if (fridayStart.getDay() === 5 && fridayStart >= today) { // Friday
          const mondayEnd = addDays(fridayStart, 3);
          const vacationDaysNeeded = getWorkDays(fridayStart, mondayEnd, holidays);
          
          periods.push({
            start: fridayStart,
            end: mondayEnd,
            days: 4,
            vacationDaysNeeded,
            description: `Lång helg ${getMonthName(month)}`,
            type: "longweekend",
            score: getScoreForPeriod(fridayStart, mondayEnd, vacationDaysNeeded, holidays, mode)
          });
        }
      }
    }
  }
  
  // Add periods around holidays (most efficient use of vacation days)
  for (const holiday of holidays) {
    if (holiday < today) continue;
    
    // Check days before and after holiday
    for (let offset = -3; offset <= 3; offset++) {
      if (offset === 0) continue; // Skip the holiday itself
      
      const startDate = offset < 0 ? addDays(holiday, offset) : holiday;
      const endDate = offset < 0 ? holiday : addDays(holiday, offset);
      
      // Skip if start date is in the past
      if (startDate < today) continue;
      
      const vacationDaysNeeded = getWorkDays(startDate, endDate, holidays);
      
      // Only add if actually need vacation days
      if (vacationDaysNeeded > 0) {
        periods.push({
          start: startDate,
          end: endDate,
          days: differenceInDays(endDate, startDate) + 1,
          vacationDaysNeeded,
          description: `Ledighet runt helgdag`,
          type: "holiday",
          score: getScoreForPeriod(startDate, endDate, vacationDaysNeeded, holidays, mode) + 30 // Bonus for holiday periods
        });
      }
    }
  }
  
  // Add some single day options (especially bridge days)
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      // Skip weekends, holidays, or past dates
      if (isDayOff(date, holidays) || date < today) continue;
      
      const prevDay = addDays(date, -1);
      const nextDay = addDays(date, 1);
      
      // Check if this is a bridge day (both adjacent days are off)
      if (isDayOff(prevDay, holidays) && isDayOff(nextDay, holidays)) {
        periods.push({
          start: date,
          end: date,
          days: 1,
          vacationDaysNeeded: 1,
          description: `Klämdag ${day}/${month + 1}`,
          type: "bridge",
          score: 100 // Bridge days are extremely valuable
        });
      }
      // Or if it extends a weekend/holiday
      else if (isDayOff(prevDay, holidays) || isDayOff(nextDay, holidays)) {
        periods.push({
          start: date,
          end: date,
          days: 1,
          vacationDaysNeeded: 1,
          description: `Helgförlängning ${day}/${month + 1}`,
          type: "extend",
          score: 80
        });
      }
    }
  }
  
  // Sort by score (higher first)
  return periods.sort((a, b) => (b.score || 0) - (a.score || 0));
}

// Score periods based on the optimization mode and efficiency
function getScoreForPeriod(
  start: Date, 
  end: Date, 
  vacationDaysNeeded: number, 
  holidays: Date[],
  mode: OptimizationMode
): number {
  const days = differenceInDays(end, start) + 1;
  
  // Base efficiency score: days off per vacation day
  const efficiency = days / Math.max(vacationDaysNeeded, 1);
  let score = efficiency * 25;
  
  // Add score based on the selected optimization mode
  switch (mode) {
    case "longweekends":
      score += days <= 4 ? 50 : days <= 6 ? 20 : -20;
      break;
    case "minibreaks":
      score += days >= 4 && days <= 6 ? 50 : days < 4 ? -10 : -20;
      break;
    case "weeks":
      score += days >= 7 && days <= 9 ? 50 : days >= 5 && days <= 12 ? 20 : -20;
      break;
    case "extended":
      score += days >= 10 ? 50 : days >= 7 ? 20 : -30;
      break;
    case "balanced":
    default:
      // Balance between all period types
      if (days <= 3) score += 20;
      else if (days <= 6) score += 30;
      else if (days <= 10) score += 40;
      else score += 35;
  }
  
  // Extra bonus for periods that include holidays
  let includesHoliday = false;
  const current = new Date(start);
  while (current <= end) {
    if (holidays.some(h => isSameDay(current, h))) {
      includesHoliday = true;
      break;
    }
    current.setDate(current.getDate() + 1);
  }
  
  if (includesHoliday) {
    score += 30;
  }
  
  return score;
}

// Find the optimal combination of periods to use the exact number of vacation days
function findOptimalCombination(periods: VacationPeriod[], targetDays: number): VacationPeriod[] {
  console.log(`Finding optimal combination for exactly ${targetDays} vacation days`);
  
  // Start with greedily selecting high-value periods
  let remainingDays = targetDays;
  let selectedPeriods: VacationPeriod[] = [];
  let daysUsed = new Set<string>();
  
  // First, try to find bridge days and high-efficiency periods
  for (const period of periods) {
    // Skip if we don't have enough days left
    if (period.vacationDaysNeeded > remainingDays) continue;
    
    // Check for date overlaps with already selected periods
    let hasOverlap = false;
    let current = new Date(period.start);
    while (current <= period.end) {
      if (daysUsed.has(formatDateToString(current))) {
        hasOverlap = true;
        break;
      }
      current.setDate(current.getDate() + 1);
    }
    
    if (!hasOverlap) {
      selectedPeriods.push(period);
      remainingDays -= period.vacationDaysNeeded;
      
      // Add all days to the used set
      current = new Date(period.start);
      while (current <= period.end) {
        daysUsed.add(formatDateToString(current));
        current.setDate(current.getDate() + 1);
      }
    }
    
    // Break if we've found an exact match
    if (remainingDays === 0) break;
  }
  
  // If we couldn't use all days, try with single days
  if (remainingDays > 0) {
    console.log(`Still have ${remainingDays} days to allocate`);
    
    // Filter to only single-day periods for remaining days
    const singleDayPeriods = periods.filter(p => 
      p.days === 1 && p.vacationDaysNeeded === 1
    );
    
    for (const period of singleDayPeriods) {
      const dateString = formatDateToString(period.start);
      if (!daysUsed.has(dateString) && remainingDays > 0) {
        selectedPeriods.push(period);
        daysUsed.add(dateString);
        remainingDays--;
      }
      
      if (remainingDays === 0) break;
    }
  }
  
  // If we still couldn't use all days, create generic single day periods
  if (remainingDays > 0) {
    console.log(`Creating ${remainingDays} generic single day periods`);
    
    // Find available weekdays to use
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Look through the next 12 months
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    let current = new Date(startDate);
    
    while (current <= endDate && remainingDays > 0) {
      const dateString = formatDateToString(current);
      
      // If it's a workday and not already used
      if (!isDayOff(current, periods.map(p => p.start)) && !daysUsed.has(dateString)) {
        const month = current.getMonth();
        const day = current.getDate();
        
        selectedPeriods.push({
          start: new Date(current),
          end: new Date(current),
          days: 1,
          vacationDaysNeeded: 1,
          description: `Ledig ${day}/${month + 1}`,
          type: "single",
          score: 20
        });
        
        daysUsed.add(dateString);
        remainingDays--;
      }
      
      current.setDate(current.getDate() + 1);
    }
  }
  
  console.log(`Selected ${selectedPeriods.length} periods using ${targetDays} vacation days`);
  
  // Sort by date
  return selectedPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Calculate total days off from all selected periods
function calculateTotalDaysOff(periods: VacationPeriod[]): number {
  const daysSet = new Set<string>();
  
  periods.forEach(period => {
    let current = new Date(period.start);
    while (current <= period.end) {
      daysSet.add(formatDateToString(current));
      current.setDate(current.getDate() + 1);
    }
  });
  
  return daysSet.size;
}

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export { isDayOff, isDateInPast, VacationPeriod, OptimizedSchedule };
