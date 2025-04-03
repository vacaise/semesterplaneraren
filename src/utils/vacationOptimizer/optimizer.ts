
import { addDays } from 'date-fns';
import { VacationPeriod, OptimizedSchedule, OptimizationMode } from './types';
import { findOptimalVacationPeriods } from './periodFinder';
import { isDayOff, isDateInPast } from './dateUtils';

// The main function that distributes vacation days optimally
export function optimizeVacation(
  year: number,
  totalVacationDays: number,
  holidays: Date[],
  mode: OptimizationMode | string
): OptimizedSchedule {
  // Filter out holidays that have already passed
  const futureHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Find all possible vacation periods
  let allPeriods = findOptimalVacationPeriods(year, futureHolidays);
  
  // Apply mode preferences
  allPeriods = applyModePreferences(allPeriods, mode);
  
  // Select optimal periods based on available vacation days
  const selectedPeriods = selectOptimalPeriods(allPeriods, totalVacationDays, mode as OptimizationMode);
  
  // Calculate total days off
  const totalDaysOff = selectedPeriods.reduce((sum, period) => sum + period.days, 0);
  
  return {
    totalDaysOff,
    vacationDaysUsed: totalVacationDays,
    mode,
    periods: selectedPeriods
  };
}

// Apply mode preferences to period selection
function applyModePreferences(
  periods: VacationPeriod[], 
  mode: string
): VacationPeriod[] {
  // Clone the periods to avoid mutating the original array
  const scoredPeriods = [...periods];
  
  // Sort based on mode preference
  switch (mode) {
    case "longweekends":
      // Prioritize short periods (1-4 days)
      return scoredPeriods.sort((a, b) => {
        if (a.days <= 4 && b.days > 4) return -1;
        if (a.days > 4 && b.days <= 4) return 1;
        // If both are the same type, sort by efficiency
        return (b.days / b.vacationDaysNeeded) - (a.days / a.vacationDaysNeeded);
      });
      
    case "minibreaks":
      // Prioritize medium periods (5-6 days)
      return scoredPeriods.sort((a, b) => {
        if ((a.days === 5 || a.days === 6) && (b.days < 5 || b.days > 6)) return -1;
        if ((b.days === 5 || b.days === 6) && (a.days < 5 || a.days > 6)) return 1;
        // If both are the same type, sort by efficiency
        return (b.days / b.vacationDaysNeeded) - (a.days / a.vacationDaysNeeded);
      });
      
    case "weeks":
      // Prioritize week-long periods (7-9 days)
      return scoredPeriods.sort((a, b) => {
        if (a.days >= 7 && a.days <= 9 && (b.days < 7 || b.days > 9)) return -1;
        if (b.days >= 7 && b.days <= 9 && (a.days < 7 || a.days > 9)) return 1;
        // If both are the same type, sort by efficiency
        return (b.days / b.vacationDaysNeeded) - (a.days / a.vacationDaysNeeded);
      });
      
    case "extended":
      // Prioritize extended periods (10+ days)
      return scoredPeriods.sort((a, b) => {
        if (a.days >= 10 && b.days < 10) return -1;
        if (a.days < 10 && b.days >= 10) return 1;
        // If both are the same type, sort by efficiency
        return (b.days / b.vacationDaysNeeded) - (a.days / a.vacationDaysNeeded);
      });
      
    case "balanced":
    default:
      // Default to sorting by efficiency
      return scoredPeriods.sort((a, b) => {
        return (b.days / b.vacationDaysNeeded) - (a.days / a.vacationDaysNeeded);
      });
  }
}

// Select optimal periods based on available vacation days
function selectOptimalPeriods(
  periods: VacationPeriod[],
  totalVacationDays: number,
  mode: OptimizationMode
): VacationPeriod[] {
  let remainingVacationDays = totalVacationDays;
  const selectedPeriods: VacationPeriod[] = [];
  
  // First pass: select highest efficiency periods that match the mode
  const periodsByEfficiency = [...periods].sort((a, b) => {
    return (b.days / b.vacationDaysNeeded) - (a.days / a.vacationDaysNeeded);
  });
  
  for (const period of periodsByEfficiency) {
    // Skip if period overlaps with already selected periods
    if (overlapsWithAny(period, selectedPeriods)) {
      continue;
    }
    
    // Skip if not enough vacation days left
    if (period.vacationDaysNeeded > remainingVacationDays) {
      continue;
    }
    
    selectedPeriods.push(period);
    remainingVacationDays -= period.vacationDaysNeeded;
    
    // Break if we've used all vacation days
    if (remainingVacationDays === 0) {
      break;
    }
  }
  
  // If we still have vacation days left, try to fill with smaller periods
  if (remainingVacationDays > 0) {
    // Sort remaining periods by vacation days needed (ascending)
    const remainingPeriods = periods.filter(period => 
      !selectedPeriods.some(selected => 
        selected.start.getTime() === period.start.getTime() &&
        selected.end.getTime() === period.end.getTime()
      )
    );
    
    const smallPeriods = [...remainingPeriods].sort((a, b) => 
      a.vacationDaysNeeded - b.vacationDaysNeeded
    );
    
    // Try to fill remaining days
    for (const period of smallPeriods) {
      // Skip if period overlaps with already selected periods
      if (overlapsWithAny(period, selectedPeriods)) {
        continue;
      }
      
      // Skip if not enough vacation days left
      if (period.vacationDaysNeeded > remainingVacationDays) {
        continue;
      }
      
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded;
      
      // Break if we've used all vacation days
      if (remainingVacationDays === 0) {
        break;
      }
    }
  }
  
  // If we still have vacation days left, create custom mini-periods
  if (remainingVacationDays > 0) {
    const customPeriods = generateCustomPeriods(remainingVacationDays, selectedPeriods, periods[0].start.getFullYear());
    selectedPeriods.push(...customPeriods);
    remainingVacationDays = 0; // All days used
  }
  
  // Sort periods chronologically
  return selectedPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Check if a period overlaps with any period in a list
function overlapsWithAny(period: VacationPeriod, periodList: VacationPeriod[]): boolean {
  return periodList.some(existingPeriod => {
    return (
      (period.start <= existingPeriod.end && period.end >= existingPeriod.start) ||
      (existingPeriod.start <= period.end && existingPeriod.end >= period.start)
    );
  });
}

// Generate custom periods to use up remaining vacation days
function generateCustomPeriods(
  remainingDays: number,
  existingPeriods: VacationPeriod[],
  year: number
): VacationPeriod[] {
  const customPeriods: VacationPeriod[] = [];
  let daysLeft = remainingDays;
  
  // Try to place individual days, starting from summer months
  const months = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 0]; // Priority order
  
  for (const month of months) {
    if (daysLeft === 0) break;
    
    // Try to place days in this month
    const startDay = month === new Date().getMonth() ? new Date().getDate() + 7 : 1;
    
    for (let day = startDay; day <= 28 && daysLeft > 0; day++) {
      const date = new Date(year, month, day);
      
      // Skip weekends and existing period days
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      if (isDateInPeriod(date, existingPeriods)) continue;
      
      // Create a one-day period
      const singleDayPeriod: VacationPeriod = {
        start: date,
        end: date,
        days: 1,
        vacationDaysNeeded: 1,
        description: `Ledig dag i ${getMonthName(month)}`,
        type: "single",
        startDate: date.toISOString(),
        endDate: date.toISOString()
      };
      
      customPeriods.push(singleDayPeriod);
      daysLeft--;
    }
  }
  
  return customPeriods;
}

// Check if a date falls within any existing period
function isDateInPeriod(date: Date, periods: VacationPeriod[]): boolean {
  return periods.some(period => {
    const periodStart = new Date(period.start);
    const periodEnd = new Date(period.end);
    return date >= periodStart && date <= periodEnd;
  });
}

// Helper function to get month name
function getMonthName(month: number): string {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[month];
}

// Calculate the efficiency of a vacation plan
export function calculateEfficiency(totalDaysOff: number, vacationDaysUsed: number): string {
  if (vacationDaysUsed <= 0) return "0";
  const efficiency = totalDaysOff / vacationDaysUsed;
  return efficiency.toFixed(2);
}
