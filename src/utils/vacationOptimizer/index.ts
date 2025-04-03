
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
  vacationDays: number,
  holidays: Date[],
  mode: string
): OptimizedSchedule => {
  // Filter out holidays that have already passed
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Find optimal periods based on the parameters with STRICT enforcement of vacation days
  const selectedPeriods = findOptimalSchedule(year, vacationDays, filteredHolidays, mode);
  
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
  
  // Calculate total vacation days used
  const totalVacationDaysUsed = validatedPeriods.reduce(
    (total, period) => total + period.vacationDaysNeeded, 
    0
  );
  
  // Verify we're using exactly the requested number of vacation days
  if (totalVacationDaysUsed !== vacationDays) {
    throw new Error(`Could not create a schedule using exactly ${vacationDays} vacation days. Algorithm produced ${totalVacationDaysUsed} days.`);
  }
  
  return {
    totalDaysOff,
    vacationDaysUsed: totalVacationDaysUsed,
    mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
