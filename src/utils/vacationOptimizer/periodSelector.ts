
import { VacationPeriod } from './types';
import { isDateInPast, formatDateToString } from './helpers';
import { verifyExactVacationDays } from './calculators';

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

// Score combinations based on optimization criteria
function scoreCombinations(
  combinations: VacationPeriod[][], 
  mode: string,
  holidays: Date[]
): VacationPeriod[][] {
  const scoredCombinations = combinations.map(combination => {
    let totalScore = 0;
    
    // Base score from individual periods
    const baseScore = combination.reduce((sum, period) => sum + (period.score || 0), 0);
    
    // Length alignment score based on selected mode
    let lengthScore = 0;
    combination.forEach(period => {
      const periodLength = period.days;
      
      switch(mode) {
        case "longweekends":
          // Favor 3-4 day periods
          lengthScore += periodLength <= 4 ? 50 : 10;
          break;
        case "minibreaks":
          // Favor 4-6 day periods
          lengthScore += (periodLength >= 4 && periodLength <= 6) ? 50 : 10;
          break;
        case "weeks":
          // Favor 7-9 day periods
          lengthScore += (periodLength >= 7 && periodLength <= 9) ? 50 : 10;
          break;
        case "extended":
          // Favor 10+ day periods
          lengthScore += periodLength >= 10 ? 50 : 10;
          break;
        case "balanced":
        default:
          // More evenly distributed scoring for balanced mode
          if (periodLength <= 4) lengthScore += 25;
          else if (periodLength <= 7) lengthScore += 35;
          else if (periodLength <= 10) lengthScore += 40;
          else lengthScore += 30;
      }
    });
    
    // Distribution score - favor spreading periods throughout the year
    const monthCoverage = new Set(combination.map(p => new Date(p.start).getMonth())).size;
    const distributionScore = monthCoverage * 10;
    
    // Efficiency score - maximize total days off
    const totalDays = combination.reduce((sum, period) => sum + period.days, 0);
    const efficiencyScore = totalDays * 2;
    
    // Holiday utilization score - favor periods that include holidays
    let holidayScore = 0;
    combination.forEach(period => {
      const start = new Date(period.start);
      const end = new Date(period.end);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (holidays.some(h => h.getDate() === d.getDate() && h.getMonth() === d.getMonth())) {
          holidayScore += 15; // Significant bonus for including holidays
        }
      }
    });
    
    // Calculate total score
    totalScore = baseScore + lengthScore + distributionScore + efficiencyScore + holidayScore;
    
    return {
      combination,
      score: totalScore
    };
  });
  
  // Sort by score (descending)
  scoredCombinations.sort((a, b) => b.score - a.score);
  
  // Return sorted combinations
  return scoredCombinations.map(item => item.combination);
}
