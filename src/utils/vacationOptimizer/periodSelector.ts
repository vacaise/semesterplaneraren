
import { createExtraPeriods } from './periodFinders';
import { VacationPeriod } from './types';
import { isDateInPast, isDayOff } from './helpers';

// Select the optimal periods based on the available vacation days
export const selectOptimalPeriods = (
  potentialPeriods: VacationPeriod[], 
  targetVacationDays: number, 
  year: number, 
  holidays: Date[], 
  mode: string
): VacationPeriod[] => {
  // Make a copy to avoid mutating the original array
  const periods = [...potentialPeriods];
  
  // Filter out periods that are entirely in the past
  const validPeriods = periods.filter(period => {
    const endDate = new Date(period.end);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return endDate >= now;
  });
  
  // Sort by efficiency (days off per vacation day needed)
  validPeriods.sort((a, b) => {
    const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
    const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
    
    // If efficiency is the same, prioritize by mode preference
    if (aEfficiency === bEfficiency) {
      return (b.score || 0) - (a.score || 0);
    }
    
    return bEfficiency - aEfficiency;
  });
  
  // Define maximum number of periods to select based on mode
  let maxPeriods = 15; // Increased to give more options
  
  if (mode === "longweekends") {
    maxPeriods = 20; // More shorter periods
  } else if (mode === "extended") {
    maxPeriods = 10; // Fewer longer periods
  }
  
  // Try to find combinations that use exactly the target number of vacation days
  const bestCombination = findExactVacationDayCombination(validPeriods, targetVacationDays, maxPeriods, mode);
  
  if (bestCombination.length > 0) {
    // Sort the final selected periods by date (chronologically)
    bestCombination.sort((a, b) => {
      return a.start.getTime() - b.start.getTime();
    });
    
    return bestCombination;
  }
  
  // If no exact combination found (this should rarely happen with proper data), fall back to greedy algorithm
  console.warn("Could not find combination using exactly the target vacation days, falling back to greedy algorithm");
  
  const selectedPeriods: VacationPeriod[] = [];
  let remainingVacationDays = targetVacationDays;
  
  for (const period of validPeriods) {
    if (period.vacationDaysNeeded <= remainingVacationDays) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded;
      
      if (remainingVacationDays === 0) {
        break; // Perfect match found
      }
    }
  }
  
  // Sort the final selected periods by date (chronologically)
  selectedPeriods.sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });
  
  return selectedPeriods;
};

// Find a combination of periods that use exactly the target number of vacation days
function findExactVacationDayCombination(
  periods: VacationPeriod[],
  targetDays: number,
  maxPeriods: number,
  mode: string
): VacationPeriod[] {
  // First try to quickly find combinations using a greedy approach
  const quickResult = findQuickCombination(periods, targetDays, maxPeriods, mode);
  if (quickResult.length > 0) {
    return quickResult;
  }
  
  // Use a more exhaustive approach if quick method fails
  console.log("Using exhaustive search for vacation combinations");
  return findBestCombination(periods, targetDays, maxPeriods, mode);
}

// Quick method to try to find a combination using a greedy approach with some backtracking
function findQuickCombination(
  periods: VacationPeriod[],
  targetDays: number,
  maxPeriods: number,
  mode: string
): VacationPeriod[] {
  // Sort periods by various criteria to try different strategies
  const strategies = [
    // 1. By efficiency (best vacation day ratio first)
    [...periods].sort((a, b) => {
      return (b.days / b.vacationDaysNeeded) - (a.days / a.vacationDaysNeeded);
    }),
    // 2. By start date (earliest first)
    [...periods].sort((a, b) => a.start.getTime() - b.start.getTime()),
    // 3. By score (highest first)
    [...periods].sort((a, b) => (b.score || 0) - (a.score || 0)),
    // 4. By vacation days needed (smallest first)
    [...periods].sort((a, b) => a.vacationDaysNeeded - b.vacationDaysNeeded),
    // 5. By vacation days needed (largest first)
    [...periods].sort((a, b) => b.vacationDaysNeeded - a.vacationDaysNeeded),
  ];
  
  // Try each strategy
  for (const sortedPeriods of strategies) {
    const result = tryGreedyCombination(sortedPeriods, targetDays, maxPeriods);
    if (result.length > 0) {
      return result;
    }
  }
  
  return [];
}

// Try to find a combination using a greedy approach
function tryGreedyCombination(
  sortedPeriods: VacationPeriod[],
  targetDays: number,
  maxPeriods: number
): VacationPeriod[] {
  const selectedPeriods: VacationPeriod[] = [];
  let remainingDays = targetDays;
  
  for (const period of sortedPeriods) {
    // Check for overlaps with already selected periods
    const hasOverlap = selectedPeriods.some(selected => {
      return (
        (period.start >= selected.start && period.start <= selected.end) ||
        (period.end >= selected.start && period.end <= selected.end) ||
        (period.start <= selected.start && period.end >= selected.end)
      );
    });
    
    if (!hasOverlap && period.vacationDaysNeeded <= remainingDays) {
      selectedPeriods.push(period);
      remainingDays -= period.vacationDaysNeeded;
      
      if (remainingDays === 0 && selectedPeriods.length <= maxPeriods) {
        return selectedPeriods; // Perfect match found
      }
    }
  }
  
  // If we didn't find an exact match, return empty array
  return [];
}

// Use a more exhaustive approach to find the best combination
function findBestCombination(
  periods: VacationPeriod[],
  targetDays: number,
  maxPeriods: number,
  mode: string
): VacationPeriod[] {
  // Filter periods to only include those that don't exceed target days
  const validPeriods = periods.filter(p => p.vacationDaysNeeded <= targetDays);
  
  // If we have too many periods, limit to most promising ones
  const limitedPeriods = validPeriods.length > 100 
    ? validPeriods.slice(0, 100) 
    : validPeriods;
  
  // Try to find combinations that sum exactly to target days
  const combinations = findCombinations(limitedPeriods, targetDays, maxPeriods, mode);
  
  if (combinations.length > 0) {
    // Sort combinations by total score, highest first
    combinations.sort((a, b) => {
      const aScore = a.reduce((sum, p) => sum + (p.score || 0), 0);
      const bScore = b.reduce((sum, p) => sum + (p.score || 0), 0);
      return bScore - aScore;
    });
    
    // Return the highest scoring combination
    return combinations[0];
  }
  
  return [];
}

// Find all combinations of periods that sum exactly to target days
function findCombinations(
  periods: VacationPeriod[],
  targetDays: number,
  maxPeriods: number,
  mode: string
): VacationPeriod[][] {
  const results: VacationPeriod[][] = [];
  
  // Recursive helper function
  function backtrack(
    start: number, 
    currentPeriods: VacationPeriod[], 
    remainingDays: number
  ) {
    // Success case: we found a combination that uses exactly the target days
    if (remainingDays === 0 && currentPeriods.length <= maxPeriods) {
      // Check for date overlaps
      let hasOverlap = false;
      for (let i = 0; i < currentPeriods.length; i++) {
        for (let j = i + 1; j < currentPeriods.length; j++) {
          const p1 = currentPeriods[i];
          const p2 = currentPeriods[j];
          if (
            (p1.start <= p2.end && p1.end >= p2.start) ||
            (p2.start <= p1.end && p2.end >= p1.start)
          ) {
            hasOverlap = true;
            break;
          }
        }
        if (hasOverlap) break;
      }
      
      if (!hasOverlap) {
        results.push([...currentPeriods]);
      }
      return;
    }
    
    // Stop if we have too many periods or negative remaining days
    if (currentPeriods.length >= maxPeriods || remainingDays < 0) {
      return;
    }
    
    // Try each period from the current position
    for (let i = start; i < periods.length; i++) {
      const period = periods[i];
      
      // Skip if this period would use too many days
      if (period.vacationDaysNeeded > remainingDays) {
        continue;
      }
      
      // Check for date overlaps with already selected periods
      let hasOverlap = false;
      for (const selectedPeriod of currentPeriods) {
        if (
          (period.start <= selectedPeriod.end && period.end >= selectedPeriod.start) ||
          (selectedPeriod.start <= period.end && selectedPeriod.end >= period.start)
        ) {
          hasOverlap = true;
          break;
        }
      }
      
      if (!hasOverlap) {
        // Include this period and continue search
        currentPeriods.push(period);
        backtrack(i + 1, currentPeriods, remainingDays - period.vacationDaysNeeded);
        currentPeriods.pop(); // backtrack
      }
      
      // Optimization: if we already have enough results, stop searching
      if (results.length >= 10) {
        return;
      }
    }
  }
  
  // Start the recursive search
  backtrack(0, [], targetDays);
  return results;
}
