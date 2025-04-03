
import { findOptimalSchedule } from './optimizer';
import { calculateTotalDaysOff } from './calculators';
import { isDayOff, isDateInPast } from './helpers';
import { VacationPeriod } from './types';
import { processPastDates } from './pastDateHandler';

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
  // Filter out holidays that have already passed
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Find potential periods based on the parameters
  const selectedPeriods = findOptimalSchedule(year, vacationDays, filteredHolidays, mode);
  
  // Verify periods don't contain any past dates
  const validatedPeriods = processPastDates(selectedPeriods);
  
  // Calculate the total days off
  const totalDaysOff = calculateTotalDaysOff(validatedPeriods, filteredHolidays);
  
  // Calculate total vacation days used
  const usedVacationDays = validatedPeriods.reduce(
    (total, period) => total + period.vacationDaysNeeded, 
    0
  );
  
  return {
    totalDaysOff: totalDaysOff,
    vacationDaysUsed: usedVacationDays, // Use the calculated value for transparency
    mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
