
import { 
  findKeyPeriods, 
  findBridgeDays, 
  findExtendedWeekends, 
  findSummerPeriods, 
  createExtraPeriods 
} from './periodFinders';
import { calculateVacationDaysNeeded } from './calculators';
import { isDateInPast } from './helpers';
import { scorePeriods } from './scoringSystem';
import { filterPastPeriods, adjustPartialPastPeriods } from './pastDateHandler';
import { selectOptimalPeriods } from './periodSelector';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
) => {
  // Collect all potential periods
  let potentialPeriods = [];
  
  // Find key holiday periods
  const keyPeriods = findKeyPeriods(year, holidays);
  potentialPeriods.push(...keyPeriods);
  
  // Find bridge days
  const bridgeDays = findBridgeDays(year);
  potentialPeriods.push(...bridgeDays);
  
  // Find extended weekends
  const weekendPeriods = findExtendedWeekends(year);
  potentialPeriods.push(...weekendPeriods);
  
  // Find summer periods
  const summerPeriods = findSummerPeriods(year);
  potentialPeriods.push(...summerPeriods);
  
  // Filter out periods that are entirely in the past
  potentialPeriods = filterPastPeriods(potentialPeriods);
  
  // Adjust periods that start in the past but end in the future
  potentialPeriods = adjustPartialPastPeriods(potentialPeriods);
  
  // Calculate actual vacation days needed for each period based on holidays
  potentialPeriods.forEach(period => {
    const actualVacationDays = calculateVacationDaysNeeded(period.start, period.end, holidays);
    period.vacationDaysNeeded = actualVacationDays;
    
    // Skip periods that would require more than the available vacation days or that require no vacation days
    if (actualVacationDays > vacationDays || actualVacationDays <= 0) {
      period.score = -1; // Mark as invalid with a negative score
    }
  });
  
  // Remove periods with negative scores (invalid periods)
  potentialPeriods = potentialPeriods.filter(period => period.score >= 0);
  
  // Score periods based on mode preference
  potentialPeriods = scorePeriods(potentialPeriods, mode);
  
  // Select the optimal periods based on the available vacation days
  const selectedPeriods = selectOptimalPeriods(potentialPeriods, vacationDays, year, holidays, mode);
  
  return selectedPeriods;
};
