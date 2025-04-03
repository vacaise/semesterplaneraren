
import { findOptimalSchedule } from './optimizer';
import { calculateTotalDaysOff } from './calculators';
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
  vacationDaysTarget: number,
  holidays: Date[],
  mode: string
): OptimizedSchedule => {
  // Filter out holidays that have already passed
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Find potential periods based on the parameters with strict requirement to use exact number of days
  const selectedPeriods = findOptimalSchedule(year, vacationDaysTarget, filteredHolidays, mode);
  
  // Verify periods don't contain any past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const validatedPeriods = selectedPeriods.filter(period => {
    const endDate = new Date(period.end);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  });
  
  // Calculate the total days off
  const totalDaysOff = calculateTotalDaysOff(validatedPeriods, filteredHolidays);
  
  // Count the actual vacation days used
  const actualVacationDaysUsed = validatedPeriods.reduce((sum, period) => sum + period.vacationDaysNeeded, 0);
  
  // Enforce the strict requirement to use exactly the number of days specified by the user
  if (actualVacationDaysUsed !== vacationDaysTarget) {
    throw new Error(`Critical error: The algorithm couldn't use exactly ${vacationDaysTarget} vacation days. Using ${actualVacationDaysUsed} days instead. This should not happen.`);
  }
  
  return {
    totalDaysOff: totalDaysOff,
    vacationDaysUsed: actualVacationDaysUsed,
    mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
