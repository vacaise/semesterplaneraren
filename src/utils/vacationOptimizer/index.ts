
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
  
  // Try up to 3 times with different strategies to use exact number of days
  let selectedPeriods;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // Find potential periods based on the parameters with strict requirement to use exact number of days
      selectedPeriods = findOptimalSchedule(year, vacationDaysTarget, filteredHolidays, mode);
      
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
      
      // Enforce the strict requirement to use exactly the number of days specified by the user
      if (actualVacationDaysUsed !== vacationDaysTarget) {
        console.warn(`Attempt ${attempts + 1}: The algorithm used ${actualVacationDaysUsed} days instead of ${vacationDaysTarget}. Trying again...`);
        throw new Error("Did not use exact vacation days");
      }
      
      // If we reach here, we found a valid schedule with the exact number of days
      return {
        totalDaysOff: totalDaysOff,
        vacationDaysUsed: actualVacationDaysUsed,
        mode,
        periods: validatedPeriods
      };
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(`Critical error: The algorithm couldn't use exactly ${vacationDaysTarget} vacation days after ${maxAttempts} attempts. Please try a different number of vacation days.`);
      }
      console.log(`Attempt ${attempts} failed, trying again with different strategy...`);
    }
  }
  
  // This should never be reached if the error is thrown correctly above
  throw new Error(`Failed to generate schedule using exactly ${vacationDaysTarget} vacation days.`);
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
