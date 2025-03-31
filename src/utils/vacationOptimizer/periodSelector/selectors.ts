
import { createExtraPeriods } from '../periodFinders';
import { VacationPeriod } from '../types';
import { isDateInPast } from '../helpers';
import { isPrimaryPeriod, isSecondaryPeriod } from './modeSelectors';
import { selectBalancedPeriods } from './balancedModeSelector';
import { selectStandardModePeriods } from './standardModeSelector';

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
  
  // For balanced mode, categorize periods by type for better distribution
  const longWeekendPeriods: VacationPeriod[] = [];
  const miniBreakPeriods: VacationPeriod[] = [];
  const weekPeriods: VacationPeriod[] = [];
  const extendedPeriods: VacationPeriod[] = [];
  
  // Sort periods into categories
  potentialPeriods.forEach(period => {
    if (mode === "balanced") {
      // In balanced mode, categorize by period length
      if (period.days <= 4) {
        longWeekendPeriods.push(period);
      } else if (period.days <= 6) {
        miniBreakPeriods.push(period);
      } else if (period.days <= 9) {
        weekPeriods.push(period);
      } else {
        extendedPeriods.push(period);
      }
    } else {
      // For other modes, use the primary/secondary categorization
      if (isPrimaryPeriod(period, mode)) {
        primaryPeriods.push(period);
      } else if (isSecondaryPeriod(period, mode)) {
        secondaryPeriods.push(period);
      } else {
        otherPeriods.push(period);
      }
    }
  });
  
  // Sort all categories by score (highest first)
  const sortByScore = (a: VacationPeriod, b: VacationPeriod) => (b.score || 0) - (a.score || 0);
  
  primaryPeriods.sort(sortByScore);
  secondaryPeriods.sort(sortByScore);
  otherPeriods.sort(sortByScore);
  longWeekendPeriods.sort(sortByScore);
  miniBreakPeriods.sort(sortByScore);
  weekPeriods.sort(sortByScore);
  extendedPeriods.sort(sortByScore);
  
  // Selection logic for balanced mode
  if (mode === "balanced") {
    const result = selectBalancedPeriods(
      longWeekendPeriods,
      miniBreakPeriods,
      weekPeriods, 
      extendedPeriods,
      vacationDays
    );
    
    selectedPeriods.push(...result.selectedPeriods);
    remainingVacationDays = result.remainingVacationDays;
  } else {
    // Original selection logic for non-balanced modes
    const result = selectStandardModePeriods(
      primaryPeriods,
      secondaryPeriods,
      otherPeriods,
      vacationDays
    );
    
    selectedPeriods.push(...result.selectedPeriods);
    remainingVacationDays = result.remainingVacationDays;
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
