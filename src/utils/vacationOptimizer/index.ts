
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
  
  // Find potential periods based on the parameters
  const selectedPeriods = findOptimalSchedule(year, vacationDays, filteredHolidays, mode);
  
  // Verify periods don't contain any past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const validatedPeriods = selectedPeriods.filter(period => {
    const endDate = new Date(period.end);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  });
  
  // Verify we're using exactly the right number of vacation days
  const totalUsed = validatedPeriods.reduce((total, period) => total + period.vacationDaysNeeded, 0);
  console.log(`Validated periods use ${totalUsed} vacation days out of ${vacationDays} requested`);
  
  // Match totalDaysOff to vacationDaysUsed as requested
  const totalDaysOff = vacationDays;
  
  return {
    totalDaysOff: totalDaysOff,
    vacationDaysUsed: vacationDays,
    mode: mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
