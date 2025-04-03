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
    // 1. By score (highest first)
    [...periods].sort((a, b) => (b.score || 0) - (a.score || 0)),
    // 2. By efficiency (best vacation day ratio first)
    [...periods].sort((a, b) => {
      return (b.days / b.vacationDaysNeeded) - (a.days / a.vacationDaysNeeded);
    }),
    // 3. By season distribution (try to get periods throughout the year)
    [...periods].sort((a, b) => {
      const aMonth = a.start.getMonth();
      const bMonth = b.start.getMonth();
      // If in same quarter, sort by score
      if (Math.floor(aMonth / 3) === Math.floor(bMonth / 3)) {
        return (b.score || 0) - (a.score || 0);
      }
      // Otherwise sort by month to get a good distribution
      return aMonth - bMonth;
    }),
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
  const selectedMonths = new Set<number>();
  
  for (const period of sortedPeriods) {
    // Check for overlaps with already selected periods
    const hasOverlap = selectedPeriods.some(selected => {
      return (
        (period.start <= selected.end && period.end >= selected.start)
      );
    });
    
    const periodMonth = period.start.getMonth();
    
    if (!hasOverlap && period.vacationDaysNeeded <= remainingDays) {
      // Penalty for concentrating too many periods in the same month
      if (selectedMonths.has(periodMonth) && selectedPeriods.length > 3) {
        // Skip this period if we already have periods in this month
        // and we have enough periods to be choosy
        // 25% chance to still accept it for some variety
        if (Math.random() > 0.25) continue;
      }
      
      selectedPeriods.push(period);
      selectedMonths.add(periodMonth);
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
  const limitedPeriods = validPeriods.length > 150
    ? validPeriods.slice(0, 150) 
    : validPeriods;
  
  // Try to find combinations that sum exactly to target days
  const combinations = findCombinations(limitedPeriods, targetDays, maxPeriods, mode);
  
  if (combinations.length > 0) {
    // Sort combinations by various factors
    combinations.sort((a, b) => {
      // First calculate total score
      const aScore = a.reduce((sum, p) => sum + (p.score || 0), 0);
      const bScore = b.reduce((sum, p) => sum + (p.score || 0), 0);
      
      // If scores are close, choose combination with better month distribution
      if (Math.abs(aScore - bScore) < 50) {
        const aMonths = new Set(a.map(p => p.start.getMonth()));
        const bMonths = new Set(b.map(p => p.start.getMonth()));
        return bMonths.size - aMonths.size; // Prefer more month variety
      }
      
      return bScore - aScore; // Otherwise choose higher score
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
  
  // Pre-sort periods to favor better distribution across the year
  periods.sort((a, b) => {
    // First by quarter (to distribute across the year)
    const aQuarter = Math.floor(a.start.getMonth() / 3);
    const bQuarter = Math.floor(b.start.getMonth() / 3);
    
    if (aQuarter !== bQuarter) {
      return aQuarter - bQuarter;
    }
    
    // Then by score within each quarter
    return (b.score || 0) - (a.score || 0);
  });
  
  // Recursive helper function
  function backtrack(
    start: number, 
    currentPeriods: VacationPeriod[], 
    remainingDays: number,
    quarterCount: number[]
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
            (p1.start <= p2.end && p1.end >= p2.start)
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
          (period.start <= selectedPeriod.end && period.end >= selectedPeriod.start)
        ) {
          hasOverlap = true;
          break;
        }
      }
      
      if (!hasOverlap) {
        // Calculate the quarter for seasonal distribution
        const periodQuarter = Math.floor(period.start.getMonth() / 3);
        const newQuarterCount = [...quarterCount];
        newQuarterCount[periodQuarter]++;
        
        // Include this period and continue search
        currentPeriods.push(period);
        backtrack(i + 1, currentPeriods, remainingDays - period.vacationDaysNeeded, newQuarterCount);
        currentPeriods.pop(); // backtrack
      }
      
      // Optimization: if we already have enough results, stop searching
      if (results.length >= 20) {
        return;
      }
    }
  }
  
  // Start the recursive search with empty quarter counts [Q1, Q2, Q3, Q4]
  backtrack(0, [], targetDays, [0, 0, 0, 0]);
  return results;
}
