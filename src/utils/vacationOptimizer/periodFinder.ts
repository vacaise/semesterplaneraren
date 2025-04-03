
import { VacationPeriod } from './types';
import { findHolidayPeriods } from './periodFinders/holidayPeriods';
import { findWeekendExtensionPeriods } from './periodFinders/weekendPeriods';
import { findTraditionalVacationPeriods } from './periodFinders/traditionalPeriods';

// Find optimal vacation periods based on holidays
export function findOptimalVacationPeriods(
  year: number, 
  holidays: Date[]
): VacationPeriod[] {
  const allPeriods: VacationPeriod[] = [];
  
  // Find periods around holidays
  allPeriods.push(...findHolidayPeriods(year, holidays));
  
  // Find weekend extension periods
  allPeriods.push(...findWeekendExtensionPeriods(year, holidays));
  
  // Find traditional vacation periods (summer, etc.)
  allPeriods.push(...findTraditionalVacationPeriods(year, holidays));
  
  // Sort by efficiency (most efficient first)
  return allPeriods.sort((a, b) => {
    const aEfficiency = a.days / a.vacationDaysNeeded;
    const bEfficiency = b.days / b.vacationDaysNeeded;
    return bEfficiency - aEfficiency;
  });
}
