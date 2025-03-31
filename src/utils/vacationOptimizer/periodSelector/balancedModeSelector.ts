
import { VacationPeriod } from '../types';

// Select periods for the balanced mode
export const selectBalancedPeriods = (
  longWeekendPeriods: VacationPeriod[],
  miniBreakPeriods: VacationPeriod[],
  weekPeriods: VacationPeriod[],
  extendedPeriods: VacationPeriod[],
  vacationDays: number
): { selectedPeriods: VacationPeriod[], remainingVacationDays: number } => {
  const selectedPeriods: VacationPeriod[] = [];
  let remainingVacationDays = vacationDays;
  
  // Define targets for each type as percentages of total vacation days
  const longWeekendTarget = Math.ceil(vacationDays * 0.35); // ~35% to long weekends
  const miniBreakTarget = Math.ceil(vacationDays * 0.30);   // ~30% to mini breaks
  const weekTarget = Math.ceil(vacationDays * 0.25);        // ~25% to week vacations
  const extendedTarget = Math.ceil(vacationDays * 0.10);    // ~10% to extended vacations
  
  let longWeekendDaysUsed = 0;
  let miniBreakDaysUsed = 0;
  let weekDaysUsed = 0;
  let extendedDaysUsed = 0;
  
  // Function to select periods from a category up to the target
  const selectFromCategory = (
    periods: VacationPeriod[], 
    target: number, 
    daysUsed: number
  ): number => {
    let updatedDaysUsed = daysUsed;
    
    for (const period of periods) {
      if (updatedDaysUsed < target && 
          (period.vacationDaysNeeded || 0) <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded || 0;
        updatedDaysUsed += period.vacationDaysNeeded || 0;
      }
      
      if (remainingVacationDays <= 0) break;
    }
    
    return updatedDaysUsed;
  };
  
  // Select from each category to achieve a balanced mix
  longWeekendDaysUsed = selectFromCategory(longWeekendPeriods, longWeekendTarget, longWeekendDaysUsed);
  miniBreakDaysUsed = selectFromCategory(miniBreakPeriods, miniBreakTarget, miniBreakDaysUsed);
  weekDaysUsed = selectFromCategory(weekPeriods, weekTarget, weekDaysUsed);
  extendedDaysUsed = selectFromCategory(extendedPeriods, extendedTarget, extendedDaysUsed);
  
  // If we still have days left, distribute them among any remaining periods
  const remainingPeriods = [...longWeekendPeriods, ...miniBreakPeriods, ...weekPeriods, ...extendedPeriods]
    .filter(period => !selectedPeriods.includes(period))
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  
  for (const period of remainingPeriods) {
    if ((period.vacationDaysNeeded || 0) <= remainingVacationDays) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded || 0;
    }
    
    if (remainingVacationDays <= 0) break;
  }
  
  return { selectedPeriods, remainingVacationDays };
};
