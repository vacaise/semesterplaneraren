
import { createExtraPeriods } from './periodFinders';
import { VacationPeriod } from './types';
import { isDateInPast } from './helpers';

// Select the optimal periods based on the available vacation days
export const selectOptimalPeriods = (
  potentialPeriods: VacationPeriod[], 
  vacationDays: number, 
  year: number, 
  holidays: Date[], 
  mode: string
): VacationPeriod[] => {
  const selectedPeriods: VacationPeriod[] = [];
  let remainingVacationDays = vacationDays;
  
  // Filter periods by mode preference, with stronger categorization
  let primaryPeriods: VacationPeriod[] = [];
  let secondaryPeriods: VacationPeriod[] = [];
  let otherPeriods: VacationPeriod[] = [];
  
  // Define the primary period criteria based on the selected mode
  const isPrimaryPeriod = (period: VacationPeriod): boolean => {
    if (mode === "longweekends" && period.days <= 4) {
      return true;
    } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
      return true;
    } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
      return true;
    } else if (mode === "extended" && period.days > 9) {
      return true;
    } else if (mode === "balanced") {
      return true; // In balanced mode, all periods can be primary
    }
    return false;
  };
  
  // Define the secondary period criteria - periods that are close to the preferred style
  const isSecondaryPeriod = (period: VacationPeriod): boolean => {
    if (mode === "longweekends" && period.days <= 6) {
      return true; // Minibreaks are secondary for longweekends
    } else if (mode === "minibreaks" && (period.days <= 4 || (period.days <= 9 && period.days > 6))) {
      return true; // Longweekends and Weeks are secondary for minibreaks
    } else if (mode === "weeks" && (period.days <= 6 && period.days > 4 || period.days > 9)) {
      return true; // Minibreaks and Extended are secondary for weeks
    } else if (mode === "extended" && period.days <= 9 && period.days > 6) {
      return true; // Weeks are secondary for extended
    } else if (mode === "balanced") {
      return false; // In balanced mode, all periods are already primary
    }
    return false;
  };
  
  // Sort periods into primary, secondary, and other categories
  potentialPeriods.forEach(period => {
    if (isPrimaryPeriod(period)) {
      primaryPeriods.push(period);
    } else if (isSecondaryPeriod(period)) {
      secondaryPeriods.push(period);
    } else {
      otherPeriods.push(period);
    }
  });
  
  // Sort primary periods by score (highest first)
  primaryPeriods.sort((a, b) => (b.score || 0) - (a.score || 0));
  
  // First pass: only select primary periods that match the mode
  // Prioritize strongly by allocating up to 80% of vacation days to primary periods
  const primaryDaysTarget = Math.ceil(vacationDays * 0.8);
  let primaryDaysUsed = 0;
  
  for (const period of primaryPeriods) {
    // If we still have room within our primary allocation target
    if (primaryDaysUsed < primaryDaysTarget && 
        (period.vacationDaysNeeded || 0) <= remainingVacationDays) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded || 0;
      primaryDaysUsed += period.vacationDaysNeeded || 0;
    }
    
    // Break if all vacation days are allocated
    if (remainingVacationDays <= 0) break;
  }
  
  // Second pass: add secondary periods if we have days left
  if (remainingVacationDays > 0) {
    // Sort secondary periods by score
    secondaryPeriods.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    for (const period of secondaryPeriods) {
      // If the period fits within remaining days
      if ((period.vacationDaysNeeded || 0) <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded || 0;
      }
      
      // Break if all vacation days are allocated
      if (remainingVacationDays <= 0) break;
    }
  }
  
  // Third pass: use other periods if we still have days left
  if (remainingVacationDays > 0) {
    // Sort other periods by score
    otherPeriods.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    for (const period of otherPeriods) {
      // If the period fits within remaining days
      if ((period.vacationDaysNeeded || 0) <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded || 0;
      }
      
      // Break if all vacation days are allocated
      if (remainingVacationDays <= 0) break;
    }
  }
  
  // Create extra small periods if there are days left
  if (remainingVacationDays > 0) {
    const extraPeriods = createExtraPeriods(year, remainingVacationDays);
    
    // Filter out past extra periods and adjust start dates if needed
    const validExtraPeriods = extraPeriods.filter(period => {
      const endDate = new Date(period.end);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      // Skip periods that have completely passed
      if (endDate < now) {
        return false;
      }
      
      const startDate = new Date(period.start);
      if (startDate < now) {
        // Set start date to today
        period.start = new Date(now);
        
        // Recalculate days based on the new start date
        const periodEndDate = new Date(period.end);
        period.days = Math.floor((periodEndDate.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        // If period becomes too short after adjustment, skip it
        if (period.days < 2) {
          return false;
        }
      }
      
      return true;
    });
    
    selectedPeriods.push(...validExtraPeriods);
  }
  
  // Sort the final selected periods by date (chronologically)
  selectedPeriods.sort((a, b) => {
    const aStartTime = new Date(a.start).getTime();
    const bStartTime = new Date(b.start).getTime();
    return aStartTime - bStartTime;
  });
  
  return selectedPeriods;
};
