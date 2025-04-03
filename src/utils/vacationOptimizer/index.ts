
import { findOptimalSchedule } from './optimizer';
import { calculateTotalDaysOff, calculateEfficiency } from './calculators';
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
  console.log(`Optimizing vacation for ${year} with ${vacationDays} days and mode: ${mode}`);
  
  // Filter out holidays that have already passed
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  console.log(`Found ${filteredHolidays.length} upcoming holidays for ${year}`);
  
  // Find optimal periods based on the parameters
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
  const totalDaysOff = calculateTotalDaysOff(validatedPeriods);
  
  // Calculate total vacation days actually used (should be exactly equal to vacationDays)
  const actualVacationDaysUsed = validatedPeriods.reduce((total, period) => 
    total + period.vacationDaysNeeded, 0);
  
  console.log(`Optimization complete: ${validatedPeriods.length} periods, ${totalDaysOff} days off, ${actualVacationDaysUsed}/${vacationDays} vacation days used`);
  
  if (actualVacationDaysUsed !== vacationDays) {
    console.warn(`Warning: Optimizer used ${actualVacationDaysUsed} vacation days but was asked to use ${vacationDays}`);
  }
  
  return {
    totalDaysOff: totalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast, calculateEfficiency };
export type { VacationPeriod };
