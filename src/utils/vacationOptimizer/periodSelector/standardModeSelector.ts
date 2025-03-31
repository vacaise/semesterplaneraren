
import { VacationPeriod } from '../types';

// Select periods for standard modes (non-balanced)
export const selectStandardModePeriods = (
  primaryPeriods: VacationPeriod[],
  secondaryPeriods: VacationPeriod[],
  otherPeriods: VacationPeriod[],
  vacationDays: number
): { selectedPeriods: VacationPeriod[], remainingVacationDays: number } => {
  const selectedPeriods: VacationPeriod[] = [];
  let remainingVacationDays = vacationDays;
  
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
  
  return { selectedPeriods, remainingVacationDays };
};
