
import { VacationPeriod } from './types';
import { isDateInPast, isDayOff, getMonthName } from './helpers';

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
  
  // Filter out periods that are entirely in the past
  const validPeriods = periods.filter(period => {
    const endDate = new Date(period.end);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return endDate >= now;
  });
  
  // Sort by score and efficiency
  validPeriods.sort((a, b) => {
    // First by score
    const scoreDiff = (b.score || 0) - (a.score || 0);
    if (Math.abs(scoreDiff) > 10) return scoreDiff;
    
    // Then by efficiency (days off per vacation day)
    const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
    const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
    return bEfficiency - aEfficiency;
  });
  
  // Consider more periods for better combinations
  const periodsToConsider = validPeriods.slice(0, 200); // Consider more periods for better chances
  
  console.log(`Finding combinations for EXACTLY ${vacationDays} vacation days...`);
  
  // Find all possible combinations that sum to EXACTLY the specified vacation days
  const exactCombinations = findCombinationsWithExactSum(periodsToConsider, vacationDays);
  
  // If no exact combinations found, throw an error to trigger the fallback mechanism
  if (exactCombinations.length === 0) {
    throw new Error(`No combination found using exactly ${vacationDays} vacation days`);
  }
  
  console.log(`Found ${exactCombinations.length} combinations with exactly ${vacationDays} vacation days`);
  
  // Score the combinations based on total days off, alignment with mode, etc.
  const scoredCombinations = scoreCombinations(exactCombinations, mode, holidays);
  
  // Return the best combination
  if (scoredCombinations.length === 0) {
    throw new Error(`Could not find a valid schedule with exactly ${vacationDays} vacation days`);
  }
  
  return scoredCombinations[0];
};

// Find all combinations that sum to exactly the target value
function findCombinationsWithExactSum(
  periods: VacationPeriod[], 
  targetSum: number, 
  maxCombinations: number = 10000
): VacationPeriod[][] {
  const results: VacationPeriod[][] = [];
  
  // Define a recursive helper function to find combinations
  const findCombinations = (
    start: number, 
    currentSum: number, 
    currentCombination: VacationPeriod[]
  ) => {
    // If we've found a valid combination
    if (currentSum === targetSum) {
      results.push([...currentCombination]);
      return;
    }
    
    // If we've exceeded the target or have too many combinations
    if (currentSum > targetSum || results.length >= maxCombinations) {
      return;
    }
    
    // Try adding each period, starting from the current position
    for (let i = start; i < periods.length; i++) {
      const period = periods[i];
      
      // Skip if adding this period would exceed the target
      if (currentSum + period.vacationDaysNeeded > targetSum) {
        continue;
      }
      
      // Skip if there's overlap with current combination
      if (hasOverlapWithCombination(period, currentCombination)) {
        continue;
      }
      
      currentCombination.push(period);
      findCombinations(i + 1, currentSum + period.vacationDaysNeeded, currentCombination);
      currentCombination.pop(); // Backtrack
    }
  };
  
  // Start the recursive search
  findCombinations(0, 0, []);
  return results;
}

// Check if a period overlaps with any period in a combination
function hasOverlapWithCombination(period: VacationPeriod, combination: VacationPeriod[]): boolean {
  return combination.some(existingPeriod => {
    const periodStart = new Date(period.start).getTime();
    const periodEnd = new Date(period.end).getTime();
    const existingStart = new Date(existingPeriod.start).getTime();
    const existingEnd = new Date(existingPeriod.end).getTime();
    
    return (
      (periodStart >= existingStart && periodStart <= existingEnd) ||
      (periodEnd >= existingStart && periodEnd <= existingEnd) ||
      (periodStart <= existingStart && periodEnd >= existingEnd)
    );
  });
}

// Score combinations based on total days off, alignment with mode, distribution, etc.
function scoreCombinations(
  combinations: VacationPeriod[][], 
  mode: string, 
  holidays: Date[]
): VacationPeriod[][] {
  // Calculate score for each combination
  const scoredCombinations = combinations.map(combination => {
    const totalDaysOff = combination.reduce((sum, period) => sum + period.days, 0);
    const totalVacationDays = combination.reduce((sum, period) => sum + period.vacationDaysNeeded, 0);
    const efficiency = totalDaysOff / totalVacationDays;
    
    // Calculate mode alignment score
    let modeScore = 0;
    combination.forEach(period => {
      if (mode === "longweekends" && period.days <= 4) modeScore += 15;
      else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) modeScore += 15;
      else if (mode === "weeks" && period.days <= 9 && period.days > 6) modeScore += 15;
      else if (mode === "extended" && period.days > 9) modeScore += 15;
      else if (mode === "balanced") modeScore += 10;
    });
    
    // Bonus for distribution throughout the year
    const monthCoverage = new Set(combination.map(p => new Date(p.start).getMonth())).size;
    const distributionScore = monthCoverage * 5;
    
    // Bonus for holidays included
    let holidayScore = 0;
    combination.forEach(period => {
      const start = new Date(period.start);
      const end = new Date(period.end);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (holidays.some(h => h.getDate() === d.getDate() && h.getMonth() === d.getMonth())) {
          holidayScore += 10;
        }
      }
    });
    
    // Calculate total score
    const score = efficiency * 10 + modeScore + distributionScore + holidayScore + totalDaysOff;
    
    return {
      combination,
      score
    };
  });
  
  // Sort by score (descending)
  scoredCombinations.sort((a, b) => b.score - a.score);
  
  // Return combinations sorted by their scores
  return scoredCombinations.map(item => item.combination);
}
