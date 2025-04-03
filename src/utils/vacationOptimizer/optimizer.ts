
import { addDays, differenceInDays, format, isSameDay } from 'date-fns';
import { VacationPeriod, OptimizationMode } from './types';
import { isDayOff } from './helpers';
import { calculateVacationDaysNeeded } from './calculators';
import { findPotentialPeriods } from './periodFinders';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): VacationPeriod[] => {
  // Generate all possible candidate periods around holidays and weekends
  const potentialPeriods = findPotentialPeriods(year, holidays);
  
  // Each potential period now has an efficiency score (days off / vacation days needed)
  // Sort by efficiency (highest first)
  potentialPeriods.sort((a, b) => {
    const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
    const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
    return bEfficiency - aEfficiency;
  });

  console.log(`Starting optimization with ${vacationDays} vacation days and ${potentialPeriods.length} potential periods`);
  
  // Find the best combination of periods that uses exactly the user's vacation days
  return selectOptimalCombination(potentialPeriods, vacationDays, holidays, mode);
};

// Select the optimal combination of periods that uses exactly the specified vacation days
const selectOptimalCombination = (
  candidates: VacationPeriod[],
  totalVacationDays: number, 
  holidays: Date[],
  mode: string
): VacationPeriod[] => {
  let remainingDays = totalVacationDays;
  const selectedPeriods: VacationPeriod[] = [];
  
  // First pass: Choose high-efficiency periods
  for (const period of candidates) {
    // Skip if period requires more vacation days than we have left
    if (period.vacationDaysNeeded > remainingDays) continue;
    
    // Skip if period overlaps with already selected periods
    const hasOverlap = selectedPeriods.some(selected => periodsOverlap(period, selected));
    if (hasOverlap) continue;
    
    // Add this period to our selection
    selectedPeriods.push(period);
    remainingDays -= period.vacationDaysNeeded;
    
    // If we've used all vacation days, we're done
    if (remainingDays === 0) break;
  }

  // If we still have vacation days remaining, we need to add more periods
  if (remainingDays > 0) {
    fillRemainingVacationDays(selectedPeriods, candidates, remainingDays, holidays);
  }

  // Sort periods by start date (chronologically)
  selectedPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());
  
  console.log(`Final schedule: ${selectedPeriods.length} periods using ${totalVacationDays} vacation days`);
  
  return selectedPeriods;
};

// Check if two periods overlap
const periodsOverlap = (period1: VacationPeriod, period2: VacationPeriod): boolean => {
  return (
    (period1.start <= period2.end && period1.end >= period2.start) ||
    (period2.start <= period1.end && period2.end >= period1.start)
  );
};

// Fill any remaining vacation days by either extending existing periods
// or finding smaller periods to fit exactly
const fillRemainingVacationDays = (
  selectedPeriods: VacationPeriod[],
  candidates: VacationPeriod[],
  remainingDays: number,
  holidays: Date[]
): void => {
  console.log(`Filling ${remainingDays} remaining vacation days`);
  
  // Try to extend existing periods first
  const extendedAny = tryExtendExistingPeriods(selectedPeriods, remainingDays, holidays);
  
  // If we still have days left, try to find shorter periods that fit exactly
  if (remainingDays > 0) {
    // Create additional single-day periods if needed
    findExactFitPeriods(selectedPeriods, candidates, remainingDays, holidays);
  }
};

// Try to extend existing periods to use more vacation days
const tryExtendExistingPeriods = (
  selectedPeriods: VacationPeriod[],
  remainingDays: number,
  holidays: Date[]
): boolean => {
  let daysUsed = 0;
  
  for (const period of selectedPeriods) {
    if (remainingDays <= 0) break;
    
    // Try to extend at the beginning
    let startDate = new Date(period.start);
    startDate = addDays(startDate, -1);
    
    while (remainingDays > 0 && !isDayOff(startDate, holidays)) {
      // Check for overlap with other periods
      const wouldOverlap = selectedPeriods.some(p => 
        p !== period && 
        startDate >= addDays(p.start, -1) && 
        startDate <= addDays(p.end, 1)
      );
      
      if (wouldOverlap) break;
      
      // Extend the period by one day at the start
      period.start = startDate;
      period.days++;
      period.vacationDaysNeeded++;
      remainingDays--;
      daysUsed++;
      
      // Try next day
      startDate = addDays(startDate, -1);
    }
    
    // Try to extend at the end
    let endDate = new Date(period.end);
    endDate = addDays(endDate, 1);
    
    while (remainingDays > 0 && !isDayOff(endDate, holidays)) {
      // Check for overlap with other periods
      const wouldOverlap = selectedPeriods.some(p => 
        p !== period && 
        endDate >= addDays(p.start, -1) && 
        endDate <= addDays(p.end, 1)
      );
      
      if (wouldOverlap) break;
      
      // Extend the period by one day at the end
      period.end = endDate;
      period.days++;
      period.vacationDaysNeeded++;
      remainingDays--;
      daysUsed++;
      
      // Try next day
      endDate = addDays(endDate, 1);
    }
  }
  
  return daysUsed > 0;
};

// Find smaller periods that fit exactly into our remaining vacation days
const findExactFitPeriods = (
  selectedPeriods: VacationPeriod[],
  candidates: VacationPeriod[],
  remainingDays: number,
  holidays: Date[]
): void => {
  // Look for periods that use exactly our remaining days
  const exactFits = candidates.filter(period => 
    period.vacationDaysNeeded === remainingDays &&
    !selectedPeriods.some(selected => periodsOverlap(period, selected))
  );
  
  if (exactFits.length > 0) {
    // Use the highest efficiency period
    selectedPeriods.push(exactFits[0]);
    remainingDays -= exactFits[0].vacationDaysNeeded;
    return;
  }
  
  // If no exact fit, find smaller periods
  const smallerFits = candidates.filter(period => 
    period.vacationDaysNeeded < remainingDays &&
    !selectedPeriods.some(selected => periodsOverlap(period, selected))
  ).sort((a, b) => b.vacationDaysNeeded - a.vacationDaysNeeded);
  
  while (remainingDays > 0 && smallerFits.length > 0) {
    // Use the largest period that fits
    const nextBestPeriod = smallerFits.find(period => period.vacationDaysNeeded <= remainingDays);
    
    if (nextBestPeriod) {
      selectedPeriods.push(nextBestPeriod);
      remainingDays -= nextBestPeriod.vacationDaysNeeded;
      
      // Remove overlapping periods
      smallerFits.filter(period => !periodsOverlap(period, nextBestPeriod));
    } else {
      break; // No suitable periods found
    }
  }
  
  // If we still have days left, create individual day periods
  if (remainingDays > 0) {
    createSingleDayPeriods(selectedPeriods, remainingDays, holidays);
  }
};

// Create single-day vacation periods for any remaining days
const createSingleDayPeriods = (
  selectedPeriods: VacationPeriod[],
  remainingDays: number,
  holidays: Date[]
): void => {
  // Find potential dates for single day periods (Fridays and Mondays are best)
  const year = new Date().getFullYear();
  
  // Start looking from current date
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  while (remainingDays > 0) {
    const dayOfWeek = currentDate.getDay();
    
    // Skip weekends and holidays
    if (isDayOff(currentDate, holidays)) {
      currentDate = addDays(currentDate, 1);
      continue;
    }
    
    // Check for overlap with other periods
    const wouldOverlap = selectedPeriods.some(p => 
      currentDate >= addDays(p.start, -1) && 
      currentDate <= addDays(p.end, 1)
    );
    
    if (!wouldOverlap) {
      // Prioritize Fridays and Mondays
      if (dayOfWeek === 5 || dayOfWeek === 1 || remainingDays <= 5) {
        // Create a single day period
        const singleDayPeriod: VacationPeriod = {
          start: new Date(currentDate),
          end: new Date(currentDate),
          days: 1,
          vacationDaysNeeded: 1,
          description: `Extra ledig dag ${format(currentDate, 'yyyy-MM-dd')}`,
          type: "single",
          score: 50
        };
        
        selectedPeriods.push(singleDayPeriod);
        remainingDays--;
      }
    }
    
    currentDate = addDays(currentDate, 1);
    
    // Avoid infinite loop - stop if we go too far into the future
    if (currentDate.getFullYear() > year + 2) {
      console.error("Failed to find suitable days for all vacation days");
      break;
    }
  }
};
