
import { findOptimalSchedule } from './optimizer';
import { calculateTotalDaysOff, sumVacationDaysNeeded } from './calculators';
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
  // Input validation
  if (!vacationDays || vacationDays <= 0) {
    throw new Error("The number of vacation days must be greater than zero");
  }

  if (!holidays || holidays.length === 0) {
    console.warn("No holidays provided, efficiency will be reduced");
  }

  console.log(`Optimizing vacation with exactly ${vacationDays} days for ${year}`);
  
  // Filter out holidays that have already passed
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Find optimal periods based on the parameters
  const selectedPeriods = findOptimalSchedule(year, vacationDays, filteredHolidays, mode);
  
  // Verify periods don't contain any past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const validatedPeriods = selectedPeriods.filter(period => {
    const endDate = new Date(period.end);
    return endDate >= today;
  });
  
  // Calculate the total days off (all days in all periods)
  const totalDaysOff = calculateTotalDaysOff(validatedPeriods, filteredHolidays);
  
  // Calculate total vacation days used (must match input)
  const totalVacationDaysUsed = sumVacationDaysNeeded(validatedPeriods);
  
  // Strict enforcement: verify we're using exactly the requested number of vacation days
  if (totalVacationDaysUsed !== vacationDays) {
    throw new Error(`Algorithm error: Expected to use exactly ${vacationDays} vacation days, but used ${totalVacationDaysUsed} days`);
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
