
import { findKeyPeriods, findBridgeDays, findExtendedWeekends, findSummerPeriods, createExtraPeriods } from './periodFinders';
import { calculateVacationDaysNeeded } from './calculators';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
) => {
  // Collect all potential periods
  const potentialPeriods = [];
  
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
  
  // Calculate actual vacation days needed for each period based on holidays
  potentialPeriods.forEach(period => {
    const actualVacationDays = calculateVacationDaysNeeded(period.start, period.end, holidays);
    period.vacationDaysNeeded = actualVacationDays;
  });
  
  // Sort periods based on mode preference
  potentialPeriods.sort((a, b) => {
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
    selectedPeriods.push(...extraPeriods);
  }
  
  return selectedPeriods;
};
