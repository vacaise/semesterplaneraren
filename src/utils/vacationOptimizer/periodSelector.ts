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
  
  // Sort by various parameters for better distribution and efficiency
  // Enhanced sorting logic to prioritize efficiency (days off per vacation day)
  validPeriods.sort((a, b) => {
    const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
    const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
    
    // Give strong preference to highly efficient periods
    if (Math.abs(aEfficiency - bEfficiency) > 0.5) {
      return bEfficiency - aEfficiency;
    }
    
    // If efficiency is similar, prioritize by score (which includes mode preference)
    return (b.score || 0) - (a.score || 0);
  });
  
  // Define maximum number of periods to select based on mode
  let maxPeriods = 20; // Increased to allow more diverse options
  
  if (mode === "longweekends") {
    maxPeriods = 25; // More shorter periods
  } else if (mode === "extended") {
    maxPeriods = 12; // Fewer longer periods
  }
  
  // Try to find combinations that use exactly the target number of vacation days
  // and achieve better year-round distribution
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
      const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
      const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
      return bEfficiency - aEfficiency;
    }),
    // 2. By score (highest first)
    [...periods].sort((a, b) => (b.score || 0) - (a.score || 0)),
    // 3. By season distribution (try to get periods throughout the year)
    [...periods].sort((a, b) => {
      const aMonth = a.start.getMonth();
      const bMonth = b.start.getMonth();
      // If in same quarter, sort by efficiency then score
      if (Math.floor(aMonth / 3) === Math.floor(bMonth / 3)) {
        const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
        const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
        
        if (Math.abs(aEfficiency - bEfficiency) > 0.5) {
          return bEfficiency - aEfficiency;
        }
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
  const quarterCount = [0, 0, 0, 0]; // Count periods per quarter for even distribution
  
  for (const period of sortedPeriods) {
    // Check for overlaps with already selected periods
    const hasOverlap = selectedPeriods.some(selected => {
      return (
        (period.start <= selected.end && period.end >= selected.start)
      );
    });
    
    const periodMonth = period.start.getMonth();
    const periodQuarter = Math.floor(periodMonth / 3);
    
    if (!hasOverlap && period.vacationDaysNeeded <= remainingDays) {
      // Stronger distribution logic - avoid concentration in a single quarter
      // Only apply this restriction if we have some periods selected
      if (selectedPeriods.length > 2) {
        // Skip if this quarter already has too many periods compared to others
        const maxQuarterCount = Math.max(...quarterCount);
        if (quarterCount[periodQuarter] >= maxQuarterCount + 1 && 
            quarterCount.some(count => count < Math.floor(maxQuarterCount / 2))) {
          // 15% chance to still accept it for some variety
          if (Math.random() > 0.15) continue;
        }
      }
      
      // Calculate efficiency to prefer high-efficiency periods
      const efficiency = period.days / period.vacationDaysNeeded;
      
      // Stronger protection against month concentration
      // If we already have 2 periods in this month and there are months with no periods,
      // be more selective
      if (selectedMonths.has(periodMonth) && 
          selectedPeriods.filter(p => p.start.getMonth() === periodMonth).length >= 2 &&
          selectedMonths.size < 6) {
        // 20% chance to still accept it for some variety
        if (Math.random() > 0.2) continue;
      }
      
      selectedPeriods.push(period);
      selectedMonths.add(periodMonth);
      quarterCount[periodQuarter]++;
      remainingDays -= period.vacationDaysNeeded;
      
      if (remainingDays === 0 && selectedPeriods.length <= maxPeriods) {
        // Check distribution for final validation
        const monthCounts = new Array(12).fill(0);
        selectedPeriods.forEach(p => {
          monthCounts[p.start.getMonth()]++;
        });
        
        const nonEmptyMonths = monthCounts.filter(count => count > 0).length;
        
        // If we have good month distribution, return the result
        if (nonEmptyMonths >= Math.min(4, selectedPeriods.length)) {
          return selectedPeriods; // Perfect match found with good distribution
        }
        
        // If poor distribution but high efficiency, accept it anyway
        const avgEfficiency = selectedPeriods.reduce((sum, p) => 
          sum + p.days / Math.max(p.vacationDaysNeeded, 1), 0) / selectedPeriods.length;
          
        if (avgEfficiency > 1.9) {
          return selectedPeriods;
        }
        
        // Otherwise, keep searching
        selectedPeriods.pop();
        selectedMonths.delete(periodMonth);
        quarterCount[periodQuarter]--;
        remainingDays += period.vacationDaysNeeded;
      }
    }
  }
  
  // If we found an exact match with reasonable distribution, return it
  if (remainingDays === 0 && selectedPeriods.length <= maxPeriods) {
    return selectedPeriods;
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
  
  // Sort by efficiency first, then by score
  validPeriods.sort((a, b) => {
    const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
    const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
    
    if (Math.abs(aEfficiency - bEfficiency) > 0.3) {
      return bEfficiency - aEfficiency;
    }
    
    return (b.score || 0) - (a.score || 0);
  });
  
  // If we have too many periods, limit to most promising ones
  const limitedPeriods = validPeriods.length > 200
    ? validPeriods.slice(0, 200) 
    : validPeriods;
  
  // Try to find combinations that sum exactly to target days
  const combinations = findCombinations(limitedPeriods, targetDays, maxPeriods, mode);
  
  if (combinations.length > 0) {
    // Sort combinations by various factors with higher emphasis on efficiency
    combinations.sort((a, b) => {
      // Calculate average efficiency
      const aAvgEfficiency = a.reduce((sum, p) => sum + (p.days / Math.max(p.vacationDaysNeeded, 1)), 0) / a.length;
      const bAvgEfficiency = b.reduce((sum, p) => sum + (p.days / Math.max(p.vacationDaysNeeded, 1)), 0) / b.length;
      
      if (Math.abs(aAvgEfficiency - bAvgEfficiency) > 0.3) {
        return bAvgEfficiency - aAvgEfficiency;
      }
      
      // If efficiencies are close, check month distribution
      const aMonths = new Set(a.map(p => p.start.getMonth()));
      const bMonths = new Set(b.map(p => p.start.getMonth()));
      
      if (Math.abs(bMonths.size - aMonths.size) > 1) {
        return bMonths.size - aMonths.size; // Prefer more month variety
      }
      
      // If month variety is similar, choose by total score
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
  
  // Pre-sort periods to improve search efficiency
  periods.sort((a, b) => {
    // First by efficiency
    const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
    const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
    
    if (Math.abs(aEfficiency - bEfficiency) > 0.5) {
      return bEfficiency - aEfficiency;
    }
    
    // Then by quarter (to distribute across the year)
    const aQuarter = Math.floor(a.start.getMonth() / 3);
    const bQuarter = Math.floor(b.start.getMonth() / 3);
    
    if (aQuarter !== bQuarter) {
      return aQuarter - bQuarter;
    }
    
    // Then by score within each quarter and efficiency band
    return (b.score || 0) - (a.score || 0);
  });
  
  // Recursive helper function with better pruning
  function backtrack(
    start: number, 
    currentPeriods: VacationPeriod[], 
    remainingDays: number,
    quarterCount: number[],
    monthSet: Set<number>
  ) {
    // Success case: we found a combination that uses exactly the target days
    if (remainingDays === 0 && currentPeriods.length <= maxPeriods) {
      // Check for date overlaps
      let hasOverlap = false;
      for (let i = 0; i < currentPeriods.length; i++) {
        for (let j = i + 1; j < currentPeriods.length; j++) {
          const p1 = currentPeriods[i];
          const p2 = currentPeriods[j];
          if ((p1.start <= p2.end && p1.end >= p2.start)) {
            hasOverlap = true;
            break;
          }
        }
        if (hasOverlap) break;
      }
      
      if (!hasOverlap) {
        // Score the combination by month distribution
        const distributionScore = monthSet.size;
        
        // Only accept combinations with at least 3 different months
        // (if we have enough periods)
        if (currentPeriods.length < 4 || distributionScore >= 3) {
          results.push([...currentPeriods]);
        }
      }
      return;
    }
    
    // Stop if we have too many periods or negative remaining days
    if (currentPeriods.length >= maxPeriods || remainingDays < 0) {
      return;
    }
    
    // Early stopping: if we don't have enough periods to cover remainingDays
    if (remainingDays > 0 && start >= periods.length) {
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
        
        // For better distribution, once we have several periods, apply a threshold
        if (currentPeriods.length >= 3) {
          const maxQuarter = Math.max(...newQuarterCount);
          const minQuarter = Math.min(...newQuarterCount);
          
          // Skip if distribution is too uneven
          if (maxQuarter > minQuarter + 2 && maxQuarter > 2) {
            continue;
          }
        }
        
        // Track months for distribution
        const newMonthSet = new Set(monthSet);
        newMonthSet.add(period.start.getMonth());
        
        // Include this period and continue search
        currentPeriods.push(period);
        backtrack(i + 1, currentPeriods, remainingDays - period.vacationDaysNeeded, newQuarterCount, newMonthSet);
        currentPeriods.pop(); // backtrack
      }
      
      // Optimization: if we already have enough results, stop searching
      if (results.length >= 30) {
        return;
      }
    }
  }
  
  // Start the recursive search with empty quarter counts [Q1, Q2, Q3, Q4]
  backtrack(0, [], targetDays, [0, 0, 0, 0], new Set());
  return results;
}
