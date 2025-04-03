
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
  
  try {
    // Find potential periods based on the parameters with strict requirement to use exact number of days
    const selectedPeriods = findOptimalSchedule(year, vacationDaysTarget, filteredHolidays, mode);
    
    // Validate periods don't contain any past dates
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
    
    // CRITICAL CHECK: Throw an error if we're not using exactly the required number of vacation days
    if (actualVacationDaysUsed !== vacationDaysTarget) {
      throw new Error(`Critical error: The algorithm used ${actualVacationDaysUsed} days instead of ${vacationDaysTarget}. This is a bug in the optimization algorithm.`);
    }
    
    return {
      totalDaysOff: totalDaysOff,
      vacationDaysUsed: actualVacationDaysUsed,
      mode,
      periods: validatedPeriods
    };
  } catch (error) {
    // Rethrow the error with a clear message for the UI
    throw new Error(`Could not create a schedule using exactly ${vacationDaysTarget} vacation days. Please try a different number of days.`);
  }
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
