
import { createExtraPeriods } from './periodFinders';
import { VacationPeriod } from './types';
import { isDateInPast, isDayOff } from './helpers';

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
  
  // Sort by efficiency (days off per vacation day needed) and apply mode preferences
  validPeriods.sort((a, b) => {
    const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
    const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
    
    // If efficiency is the same, prioritize by mode preference
    if (Math.abs(aEfficiency - bEfficiency) < 0.1) {
      return (b.score || 0) - (a.score || 0);
    }
    
    return bEfficiency - aEfficiency;
  });
  
  // Define maximum number of periods to consider for combinations
  const maxPeriodsToConsider = 50;  // Consider more periods for better combinations
  const periodsToConsider = validPeriods.slice(0, maxPeriodsToConsider);
  
  // Find all possible combinations that sum to exactly the specified vacation days
  const exactCombinations = findCombinationsWithExactSum(periodsToConsider, vacationDays);
  
  // No exact combinations found, we need to try again with more periods or a different approach
  if (exactCombinations.length === 0) {
    console.warn("No exact combinations found. Creating alternative periods...");
    
    // Try to create more specific periods that might work better for the exact day count
    const alternativePeriods = createAlternativePeriods(year, holidays, vacationDays);
    const allPossiblePeriods = [...validPeriods, ...alternativePeriods];
    
    // Try again with the expanded set of periods
    const secondAttemptCombinations = findCombinationsWithExactSum(
      allPossiblePeriods.slice(0, 100), // Consider even more periods
      vacationDays
    );
    
    if (secondAttemptCombinations.length > 0) {
      // Score and sort the combinations
      const scoredCombinations = scoreCombinations(secondAttemptCombinations, mode);
      return scoredCombinations[0]; // Return the best combination
    }
    
    throw new Error(`Could not create a schedule using exactly ${vacationDays} vacation days. Try a different number.`);
  }
  
  // Score and sort the combinations based on various factors
  const scoredCombinations = scoreCombinations(exactCombinations, mode);
  return scoredCombinations[0]; // Return the best combination
};

// Find all combinations that sum to exactly the target value
function findCombinationsWithExactSum(
  periods: VacationPeriod[], 
  targetSum: number, 
  maxCombinations: number = 1000
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

// Score combinations based on total days off, alignment with mode, etc.
function scoreCombinations(combinations: VacationPeriod[][], mode: string): VacationPeriod[][] {
  // Calculate score for each combination
  const scoredCombinations = combinations.map(combination => {
    const totalDaysOff = combination.reduce((sum, period) => sum + period.days, 0);
    const avgEfficiency = totalDaysOff / combination.reduce((sum, period) => sum + period.vacationDaysNeeded, 0);
    
    // Calculate how well the combination matches the mode
    let modeScore = 0;
    combination.forEach(period => {
      if (mode === "longweekends" && period.days <= 4) modeScore += 10;
      else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) modeScore += 10;
      else if (mode === "weeks" && period.days <= 9 && period.days > 6) modeScore += 10;
      else if (mode === "extended" && period.days > 9) modeScore += 10;
      else if (mode === "balanced") modeScore += 5;
    });
    
    // Calculate total score (adjust weights as needed)
    const score = avgEfficiency * 5 + modeScore + totalDaysOff * 0.1;
    
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

// Create alternative periods that might help reach the exact vacation day count
function createAlternativePeriods(year: number, holidays: Date[], targetVacationDays: number): VacationPeriod[] {
  const alternativePeriods: VacationPeriod[] = [];
  
  // Create shorter periods (1-3 days)
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day += 4) {
      const startDate = new Date(year, month, day);
      
      // Skip past days
      const now = new Date();
      if (startDate < now) continue;
      
      // Create 1, 2, and 3 day periods
      for (let length = 1; length <= Math.min(targetVacationDays, 3); length++) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + length - 1);
        
        // Calculate vacation days needed
        let vacationDaysNeeded = 0;
        const currentDay = new Date(startDate);
        
        while (currentDay <= endDate) {
          if (!isDayOff(currentDay, holidays)) {
            vacationDaysNeeded++;
          }
          currentDay.setDate(currentDay.getDate() + 1);
        }
        
        if (vacationDaysNeeded > 0) {
          const monthName = getMonthName(month);
          alternativePeriods.push({
            start: new Date(startDate),
            end: new Date(endDate),
            days: length,
            vacationDaysNeeded,
            description: `${length} dag(ar) i ${monthName}`,
            type: "custom",
            score: 40
          });
        }
      }
    }
  }
  
  // Create periods exactly matching the target vacation days if possible
  const periodStart = new Date(year, 5, 15); // Mid-June
  const periodEnd = new Date(year, 5, 15 + targetVacationDays - 1); // Add target days
  
  alternativePeriods.push({
    start: new Date(periodStart),
    end: new Date(periodEnd),
    days: targetVacationDays,
    vacationDaysNeeded: targetVacationDays,
    description: `${targetVacationDays} dagars semester`,
    type: "custom",
    score: 80
  });
  
  return alternativePeriods;
}

// Helper function to get month name
const getMonthName = (monthIndex: number): string => {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
};
