
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
  
  // First pass: prioritize high-value periods
  for (const period of potentialPeriods) {
    // Check if the period has high value (is an important holiday period)
    if ((period.score || 0) >= 75 && (period.vacationDaysNeeded || 0) <= remainingVacationDays) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded || 0;
    }
    
    // Break if all vacation days are allocated
    if (remainingVacationDays <= 0) break;
  }
  
  // Second pass: add periods based on optimization mode
  if (remainingVacationDays > 0) {
    for (const period of potentialPeriods) {
      // Skip already selected periods
      if (selectedPeriods.some(p => p === period)) continue;
      
      // Check if the period fits the optimization mode and if we have enough days
      let periodFitsMode = false;
      
      if (mode === "longweekends" && period.days <= 4) periodFitsMode = true;
      else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) periodFitsMode = true;
      else if (mode === "weeks" && period.days <= 9 && period.days > 6) periodFitsMode = true;
      else if (mode === "extended" && period.days > 9) periodFitsMode = true;
      else if (mode === "balanced") periodFitsMode = true;
      
      if (periodFitsMode && (period.vacationDaysNeeded || 0) <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded || 0;
      }
      
      // Break if all vacation days are allocated
      if (remainingVacationDays <= 0) break;
    }
  }
  
  // Third pass: use remaining days
  if (remainingVacationDays > 0) {
    // Choose smaller periods or short breaks
    for (const period of potentialPeriods) {
      // Skip already selected periods
      if (selectedPeriods.some(p => p === period)) continue;
      
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
