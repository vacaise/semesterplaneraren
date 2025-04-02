
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
  
  // Find potential periods based on the parameters and ensure ALL vacation days are used
  const selectedPeriods = findOptimalSchedule(year, vacationDays, filteredHolidays, mode, true);
  
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
  
  // Ensure the vacation days used matches exactly what was requested
  const actualVacationDaysUsed = validatedPeriods.reduce((total, period) => 
    total + period.vacationDaysNeeded, 0);
  
  return {
    totalDaysOff: totalDaysOff,
    vacationDaysUsed: actualVacationDaysUsed, // Use the actual count from periods
    mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
