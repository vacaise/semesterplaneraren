
import { OptimizedSchedule, OptimizationMode } from './types';
import { findAllPotentialPeriods } from './potentialPeriodFinder';
import { sortPeriodsByModeAndEfficiency, selectOptimalPeriods } from './periodSelector';
import { SwedishHoliday } from '../swedishHolidays';

// Main optimization function
export function optimizeVacation(
  year: number,
  totalVacationDays: number,
  holidays: SwedishHoliday[],
  mode: OptimizationMode | string
): OptimizedSchedule {
  // Find potential vacation periods with high efficiency
  const potentialPeriods = findAllPotentialPeriods(year, holidays);
  
  // Sort periods by mode and efficiency
  const sortedPeriods = sortPeriodsByModeAndEfficiency(potentialPeriods, mode as OptimizationMode);
  
  // Select the optimal periods based on available vacation days
  const selectedPeriods = selectOptimalPeriods(sortedPeriods, totalVacationDays, mode as OptimizationMode);
  
  // Calculate total days off
  const totalDaysOff = selectedPeriods.reduce((sum, period) => sum + period.days, 0);
  
  return {
    totalDaysOff,
    vacationDaysUsed: totalVacationDays,
    mode,
    periods: selectedPeriods
  };
}
