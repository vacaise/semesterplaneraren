
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
import { processPastDates } from './pastDateHandler';
import { selectOptimalPeriods } from './periodSelector';
import { VacationPeriod } from './types';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
) => {
  // Collect all potential periods
  let potentialPeriods: VacationPeriod[] = [];
  
  // Find key holiday periods
  const keyPeriods = findKeyPeriods(year, holidays);
  potentialPeriods.push(...keyPeriods);
  
  // Find bridge days
  const bridgeDays = findBridgeDays(year);
  potentialPeriods.push(...bridgeDays);
  
  // Generate additional periods based on mode
  // For long weekend mode, generate more weekend options
  if (mode === "longweekends") {
    const weekendPeriods = findExtendedWeekends(year);
    // Add more weekend options for this mode
    potentialPeriods.push(...weekendPeriods);
    potentialPeriods.push(...weekendPeriods.map(p => ({...p, start: new Date(p.start), end: new Date(p.end)})));
  } else {
    // For other modes, just add the regular weekend periods
    const weekendPeriods = findExtendedWeekends(year);
    potentialPeriods.push(...weekendPeriods);
  }
  
  // Find summer periods - adjust based on mode
  const summerPeriods = findSummerPeriods(year);
  if (mode === "extended" || mode === "weeks") {
    // For extended or weeks modes, prioritize summer periods
    summerPeriods.forEach(p => p.score = (p.score || 0) + 15);
  }
  potentialPeriods.push(...summerPeriods);
  
  // Handle periods with dates in the past
  potentialPeriods = processPastDates(potentialPeriods);
  
  // Calculate actual vacation days needed for each period based on holidays
  potentialPeriods.forEach(period => {
    const actualVacationDays = calculateVacationDaysNeeded(period.start, period.end, holidays);
    period.vacationDaysNeeded = actualVacationDays;
    
    // Calculate efficiency ratio (days off / vacation days needed)
    if (actualVacationDays > 0) {
      const efficiencyRatio = period.days / actualVacationDays;
      
      // Boost the score of highly efficient periods
      if (efficiencyRatio > 2.5) {
        period.score = (period.score || 0) * 1.4; // 40% boost for super efficient periods
      } else if (efficiencyRatio > 2.0) {
        period.score = (period.score || 0) * 1.3; // 30% boost for very efficient periods
      } else if (efficiencyRatio > 1.7) {
        period.score = (period.score || 0) * 1.2; // 20% boost for efficient periods
      }
    }
    
    // Skip periods that would require more than the available vacation days or that require no vacation days
    if (actualVacationDays > vacationDays || actualVacationDays <= 0) {
      period.score = -1; // Mark as invalid with a negative score
    }
  });
  
  // Remove periods with negative scores (invalid periods)
  potentialPeriods = potentialPeriods.filter(period => (period.score || 0) >= 0);
  
  // Score periods based on mode preference and pass holidays to consider them in scoring
  potentialPeriods = scorePeriods(potentialPeriods, mode, holidays);
  
  // Select the optimal periods based on the available vacation days
  const selectedPeriods = selectOptimalPeriods(potentialPeriods, vacationDays, year, holidays, mode);
  
  return {
    periods: selectedPeriods
  };
};
