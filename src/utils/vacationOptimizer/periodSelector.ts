
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
  let maxPeriods = 10; // Default
  
  if (mode === "longweekends") {
    maxPeriods = 15; // More shorter periods
  } else if (mode === "extended") {
    maxPeriods = 5; // Fewer longer periods
  }
  
  // First pass: try to select periods with extremely high efficiency
  const selectedPeriods: VacationPeriod[] = [];
  let remainingVacationDays = vacationDays;
  
  // First select periods that match the requested mode
  for (const period of validPeriods) {
    let isPreferredType = false;
    
    if (mode === "longweekends" && period.days <= 4) {
      isPreferredType = true;
    } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
      isPreferredType = true;
    } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
      isPreferredType = true;
    } else if (mode === "extended" && period.days > 9) {
      isPreferredType = true;
    } else if (mode === "balanced") {
      isPreferredType = true;
    }
    
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    
    // Only select high-efficiency periods that match the mode
    if (isPreferredType && efficiency >= 1.5 && period.vacationDaysNeeded <= remainingVacationDays) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded;
      
      // If we've hit our target or run out of vacation days, break
      if (selectedPeriods.length >= maxPeriods || remainingVacationDays <= 0) {
        break;
      }
    }
  }
  
  // Second pass: fill in remaining vacation days with efficient periods
  if (remainingVacationDays > 0) {
    for (const period of validPeriods) {
      // Skip already selected periods
      if (selectedPeriods.some(p => 
        p.start.getTime() === period.start.getTime() && 
        p.end.getTime() === period.end.getTime()
      )) {
        continue;
      }
      
      if (period.vacationDaysNeeded <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded;
      }
      
      // If we've hit our target or run out of vacation days, break
      if (selectedPeriods.length >= maxPeriods || remainingVacationDays <= 0) {
        break;
      }
    }
  }
  
  // Final attempt: if we still have vacation days, add extra small periods
  if (remainingVacationDays > 0) {
    const extraPeriods = createExtraPeriods(year, holidays);
    
    for (const period of extraPeriods) {
      if (period.vacationDaysNeeded <= remainingVacationDays) {
        // Check that there's no overlap with existing periods
        const hasOverlap = selectedPeriods.some(selected => {
          return (
            (period.start >= selected.start && period.start <= selected.end) ||
            (period.end >= selected.start && period.end <= selected.end) ||
            (period.start <= selected.start && period.end >= selected.end)
          );
        });
        
        if (!hasOverlap) {
          selectedPeriods.push(period);
          remainingVacationDays -= period.vacationDaysNeeded;
        }
      }
      
      if (remainingVacationDays <= 0) break;
    }
  }
  
  // Sort the final selected periods by date (chronologically)
  selectedPeriods.sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });
  
  return selectedPeriods;
};
