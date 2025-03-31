
import { 
  findKeyPeriods, 
  findBridgeDays, 
  findExtendedWeekends, 
  findSummerPeriods, 
  createExtraPeriods 
} from './periodFinders';
import { calculateVacationDaysNeeded, calculateTotalDaysOff } from './calculators';
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
  
  // Calculate total days off from selected periods
  const totalDays = selectedPeriods.reduce((sum, period) => sum + period.days, 0);
  
  // But also calculate unique total days to avoid double counting
  const totalUniqueCards = calculateTotalDaysOff(selectedPeriods, holidays);
  
  console.log("Total days from adding period.days:", totalDays);
  console.log("Total unique days (removing overlaps):", totalUniqueCards);
  
  return {
    periods: selectedPeriods,
    totalDaysOff: totalUniqueCards
  };
};
