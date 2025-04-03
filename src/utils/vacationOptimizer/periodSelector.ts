
import { VacationPeriod, OptimizationMode, PotentialPeriod } from './types';
import { overlapsWithAny } from './helpers';
import { determinePeriodType } from './helpers';

// Sort periods by mode and efficiency
export function sortPeriodsByModeAndEfficiency(
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
export function selectOptimalPeriods(
  sortedPeriods: PotentialPeriod[],
  totalVacationDays: number,
  mode: OptimizationMode
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
  
  // Second pass: if we still have vacation days left, add shorter periods
  if (remainingVacationDays > 0 && sortedPeriods.length > 0) {
    const additionalPeriods = distributeRemainingDays(remainingVacationDays, selectedPeriods, sortedPeriods);
    selectedPeriods.push(...additionalPeriods);
  }
  
  // Sort periods chronologically
  return selectedPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Distribute remaining vacation days
function distributeRemainingDays(
  remainingDays: number,
  selectedPeriods: VacationPeriod[],
  allPeriods: PotentialPeriod[]
): VacationPeriod[] {
  const additionalPeriods: VacationPeriod[] = [];
  
  // Create a copy of all periods sorted by efficiency
  const candidatePeriods = [...allPeriods]
    .filter(p => p.vacationDaysNeeded <= remainingDays)
    .sort((a, b) => b.efficiency - a.efficiency);
  
  for (const period of candidatePeriods) {
    if (remainingDays <= 0) break;
    
    // Skip if period overlaps with already selected periods
    if (overlapsWithAny(period.start, period.end, [...selectedPeriods, ...additionalPeriods])) {
      continue;
    }
    
    // Skip if not enough vacation days left
    if (period.vacationDaysNeeded > remainingDays) {
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
    
    additionalPeriods.push(vacationPeriod);
    remainingDays -= period.vacationDaysNeeded;
  }
  
  return additionalPeriods;
}
