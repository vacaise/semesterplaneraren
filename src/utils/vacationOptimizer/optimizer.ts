
import { findKeyPeriods, findBridgeDays, findExtendedWeekends, findSummerPeriods, createExtraPeriods } from './periodFinders';
import { calculateVacationDaysNeeded } from './calculators';
import { isDateInPast } from './helpers';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
) => {
  // Get current date to filter out past periods
  const currentDate = new Date();
  
  // Collect all potential periods
  let potentialPeriods = [];
  
  // Find key holiday periods
  const keyPeriods = findKeyPeriods(year, holidays);
  potentialPeriods.push(...keyPeriods);
  
  // Find bridge days
  const bridgeDays = findBridgeDays(year);
  potentialPeriods.push(...bridgeDays);
  
  // Find extended weekends
  const weekendPeriods = findExtendedWeekends(year);
  potentialPeriods.push(...weekendPeriods);
  
  // Find summer periods
  const summerPeriods = findSummerPeriods(year);
  potentialPeriods.push(...summerPeriods);
  
  // CRITICAL: Filter out periods that are entirely in the past
  potentialPeriods = potentialPeriods.filter(period => {
    const endDate = new Date(period.end);
    // Skip periods that have completely passed
    return !isDateInPast(endDate);
  });
  
  // CRITICAL: Adjust periods that start in the past but end in the future
  potentialPeriods.forEach(period => {
    const startDate = new Date(period.start);
    if (isDateInPast(startDate)) {
      // Set start date to today
      const todayDate = new Date();
      period.start = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
      
      // Recalculate days based on the new start date
      const endDate = new Date(period.end);
      period.days = Math.floor((endDate.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
  });
  
  // Remove periods that became too short after adjustment
  potentialPeriods = potentialPeriods.filter(period => period.days >= 2);
  
  // Calculate actual vacation days needed for each period based on holidays
  potentialPeriods.forEach(period => {
    const actualVacationDays = calculateVacationDaysNeeded(period.start, period.end, holidays);
    period.vacationDaysNeeded = actualVacationDays;
    
    // Skip periods that would require more than the available vacation days or that require no vacation days
    if (actualVacationDays > vacationDays || actualVacationDays <= 0) {
      period.score = -1; // Mark as invalid with a negative score
    }
  });
  
  // Remove periods with negative scores (invalid periods)
  potentialPeriods = potentialPeriods.filter(period => period.score >= 0);
  
  // Sort periods based on mode preference and chronologically (starting with nearest date)
  potentialPeriods.sort((a, b) => {
    // First sort by start date (chronologically)
    const aStartTime = new Date(a.start).getTime();
    const bStartTime = new Date(b.start).getTime();
    
    if (aStartTime !== bStartTime) {
      return aStartTime - bStartTime; // Earlier periods first
    }
    
    // If dates are the same, sort by score and mode preference
    let aScore = a.score;
    let bScore = b.score;
    
    // Adjust scores based on optimization mode
    if (mode === "longweekends" && a.days <= 4) aScore += 30;
    if (mode === "longweekends" && b.days <= 4) bScore += 30;
    
    if (mode === "minibreaks" && a.days <= 6 && a.days > 4) aScore += 30;
    if (mode === "minibreaks" && b.days <= 6 && b.days > 4) bScore += 30;
    
    if (mode === "weeks" && a.days <= 9 && a.days > 6) aScore += 30;
    if (mode === "weeks" && b.days <= 9 && b.days > 6) bScore += 30;
    
    if (mode === "extended" && a.days > 9) aScore += 30;
    if (mode === "extended" && b.days > 9) bScore += 30;
    
    // Sort by score, higher score first
    return bScore - aScore;
  });
  
  // Optimize distribution of vacation days
  const selectedPeriods = [];
  let remainingVacationDays = vacationDays;
  
  // First pass: prioritize high-value periods
  for (const period of potentialPeriods) {
    // Check if the period has high value (is an important holiday period)
    if (period.score >= 75 && period.vacationDaysNeeded <= remainingVacationDays) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded;
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
      
      if (periodFitsMode && period.vacationDaysNeeded <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded;
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
      if (period.vacationDaysNeeded <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded;
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
      // Skip periods that have completely passed
      if (isDateInPast(endDate)) {
        return false;
      }
      
      const startDate = new Date(period.start);
      if (isDateInPast(startDate)) {
        // Set start date to today
        const todayDate = new Date();
        period.start = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
        
        // Recalculate days based on the new start date
        const endDate = new Date(period.end);
        period.days = Math.floor((endDate.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
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
