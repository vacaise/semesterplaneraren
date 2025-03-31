
// Main entry point for the vacation optimizer
import { findOptimalSchedule } from './optimizer';
import { calculateTotalDaysOff, calculateEfficiencyRatio } from './calculators';
import { isDayOff, isDateInPast } from './helpers';
import { VacationPeriod } from './types';

interface OptimizedSchedule {
  totalDaysOff: number;
  vacationDaysUsed: number;
  mode: string;
  periods: VacationPeriod[];
}

// Main export function for optimizing vacation
export const optimizeVacation = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): OptimizedSchedule => {
  // CRITICAL: Filter out holidays that have already passed
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Find potential periods based on the parameters
  const { periods: selectedPeriods, totalDaysOff } = findOptimalSchedule(year, vacationDays, filteredHolidays, mode);
  
  // IMPORTANT: verify periods don't contain any past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const validatedPeriods = selectedPeriods.filter(period => {
    const endDate = new Date(period.end);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  });

  // Recalculate total days off directly from the validated periods - this is critical for accuracy
  const actualTotalDaysOff = calculateTotalDaysOff(validatedPeriods, filteredHolidays);
  
  // Count the sum of all days from periods without considering overlaps, for debugging
  const totalDayCount = validatedPeriods.reduce((sum, period) => sum + period.days, 0);
  console.log("Sum of all period days:", totalDayCount);
  console.log("Total unique days off:", actualTotalDaysOff);
  
  return {
    totalDaysOff: actualTotalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
