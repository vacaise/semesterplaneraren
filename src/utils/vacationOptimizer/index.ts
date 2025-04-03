
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
  console.log(`Starting optimization for ${year} with ${vacationDays} vacation days using ${mode} mode`);
  
  // Input validation
  if (!vacationDays || vacationDays <= 0) {
    console.error("Invalid vacation days:", vacationDays);
    throw new Error("The number of vacation days must be greater than zero");
  }

  if (!holidays || holidays.length === 0) {
    console.warn("No holidays provided, efficiency will be reduced");
  }
  
  // Debug information
  console.log(`Year: ${year}, Vacation days: ${vacationDays}, Mode: ${mode}`);
  console.log(`Holidays: ${holidays.length} days`);
  
  // Filter out holidays that have already passed
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  console.log(`After filtering past dates, ${filteredHolidays.length} holidays remain`);
  
  try {
    // Find optimal periods based on the parameters
    const selectedPeriods = findOptimalSchedule(year, vacationDays, filteredHolidays, mode);
    console.log(`Found ${selectedPeriods.length} optimal periods`);
    
    // Verify periods don't contain any past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const validatedPeriods = selectedPeriods.filter(period => {
      const endDate = new Date(period.end);
      return endDate >= today;
    });
    
    console.log(`After filtering past periods, ${validatedPeriods.length} periods remain`);
    
    // Calculate the total days off (all days in all periods)
    const totalDaysOff = calculateTotalDaysOff(validatedPeriods, filteredHolidays);
    
    // Calculate total vacation days used (must match input)
    const totalVacationDaysUsed = sumVacationDaysNeeded(validatedPeriods);
    
    console.log(`Total days off: ${totalDaysOff}, Vacation days used: ${totalVacationDaysUsed}`);
    
    // Strict enforcement: verify we're using exactly the requested number of vacation days
    if (totalVacationDaysUsed !== vacationDays) {
      console.error(`Vacation days mismatch: Expected ${vacationDays}, got ${totalVacationDaysUsed}`);
      throw new Error(`Algorithm error: Expected to use exactly ${vacationDays} vacation days, but used ${totalVacationDaysUsed} days`);
    }
    
    // Make sure dates are serializable
    const serializedPeriods = validatedPeriods.map(period => ({
      ...period,
      start: new Date(period.start),
      end: new Date(period.end),
    }));
    
    // Everything is good, return the optimized schedule
    return {
      totalDaysOff,
      vacationDaysUsed: totalVacationDaysUsed,
      mode,
      periods: serializedPeriods
    };
  } catch (error) {
    console.error("Optimization failed:", error);
    throw error; // Re-throw to be handled by caller
  }
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
