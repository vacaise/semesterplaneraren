
import { VacationPeriod } from './types';
import { isDateInPast, formatDateToString } from './helpers';
import { verifyExactVacationDays } from './calculators';
import { scoreCombination } from './scoringSystem';

// Select the optimal periods based on the available vacation days
export const selectOptimalPeriods = (
  potentialPeriods: VacationPeriod[], 
  vacationDays: number, 
  year: number, 
  holidays: Date[], 
  mode: string
): VacationPeriod[] => {
  // Make a copy to avoid mutating the original array
  const periods = [...potentialPeriods];
  
  // Filter out periods that are in the past
  const validPeriods = periods.filter(period => {
    const endDate = new Date(period.end);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return endDate >= now;
  });
  
  console.log(`Finding combinations using EXACTLY ${vacationDays} vacation days...`);
  
  // Find combinations that use exactly the specified vacation days
  const exactCombinations = findCombinationsWithExactSum(validPeriods, vacationDays);
  
  // If no exact combinations found, throw a clear error
  if (exactCombinations.length === 0) {
    throw new Error(`Could not find a valid schedule using exactly ${vacationDays} vacation days. Try a different number of days or a different optimization style.`);
  }
  
  console.log(`Found ${exactCombinations.length} combinations using exactly ${vacationDays} days`);
  
  // Score the combinations based on optimization criteria
  const scoredCombinations = scoreCombinations(exactCombinations, mode, holidays);
  
  // Return the best combination
  return scoredCombinations[0];
};

// Find all combinations that sum to exactly the target vacation days
function findCombinationsWithExactSum(
  periods: VacationPeriod[], 
  targetVacationDays: number,
  maxCombinations = 10000
): VacationPeriod[][] {
  const results: VacationPeriod[][] = [];
  let counter = 0;
  
  // Define recursive function to find combinations
  const findCombinations = (
    start: number,
    currentSum: number,
    currentCombination: VacationPeriod[],
    daysSet: Set<string>
  ) => {
    // If we've reached the target sum exactly
    if (currentSum === targetVacationDays) {
      results.push([...currentCombination]);
      return;
    }
    
    // If we've exceeded the target or limit
    if (currentSum > targetVacationDays || 
        counter >= maxCombinations ||
        results.length >= 1000) {
      return;
    }
    
    counter++;
    
    // Try adding each period from the current position
    for (let i = start; i < periods.length; i++) {
      const period = periods[i];
      
      // Skip if adding this period would exceed target
      if (currentSum + period.vacationDaysNeeded > targetVacationDays) {
        continue;
      }
      
      // Check for date overlaps with current combination
      if (hasOverlap(period, currentCombination, daysSet)) {
        continue;
      }
      
      // Add period to current combination
      currentCombination.push(period);
      
      // Add all days to the set to track overlaps
      const newDaysSet = new Set(daysSet);
      addPeriodDaysToSet(period, newDaysSet);
      
      // Continue searching with updated parameters
      findCombinations(i + 1, currentSum + period.vacationDaysNeeded, currentCombination, newDaysSet);
      
      // Backtrack
      currentCombination.pop();
    }
  };
  
  // Start the recursive search
  findCombinations(0, 0, [], new Set<string>());
  
  // Double-check all returned combinations use exactly the target days
  const verifiedResults = results.filter(combination => 
    verifyExactVacationDays(combination, targetVacationDays)
  );
  
  return verifiedResults;
}

// Check if a period overlaps with existing periods
function hasOverlap(
  period: VacationPeriod, 
  combination: VacationPeriod[],
  daysSet: Set<string>
): boolean {
  const start = new Date(period.start);
  const end = new Date(period.end);
  
  // Check if any day in this period is already in the set
  let currentDay = new Date(start);
  while (currentDay <= end) {
    const dayString = formatDateToString(currentDay);
    if (daysSet.has(dayString)) {
      return true;
    }
    currentDay.setDate(currentDay.getDate() + 1);
  }
  
  return false;
}

// Add all days of a period to a set
function addPeriodDaysToSet(period: VacationPeriod, daysSet: Set<string>): void {
  const start = new Date(period.start);
  const end = new Date(period.end);
  
  let currentDay = new Date(start);
  while (currentDay <= end) {
    daysSet.add(formatDateToString(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }
}

// Score combinations based on optimization criteria using our enhanced scoring function
function scoreCombinations(
  combinations: VacationPeriod[][], 
  mode: string,
  holidays: Date[]
): VacationPeriod[][] {
  const scoredCombinations = combinations.map(combination => {
    const score = scoreCombination(combination, mode, holidays);
    
    return {
      combination,
      score
    };
  });
  
  // Sort by score (descending)
  scoredCombinations.sort((a, b) => b.score - a.score);
  
  // Return sorted combinations
  return scoredCombinations.map(item => item.combination);
}
