
import { addDays, differenceInDays } from 'date-fns';
import { calculateEaster, calculateMidsummer } from '../../dateCalculators';
import { VacationPeriod } from '../../types';
import { findEasterPeriods } from './easterPeriods';
import { findMidsummerPeriods } from './midsummerPeriods';
import { findChristmasPeriods } from './christmasPeriods';
import { findHolidaySpecificPeriods } from './holidaySpecificPeriods';
import { findHolidayClusterPeriods } from './holidayClusterPeriods';

// Main function to find all key holiday periods
export const findKeyPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Calculate important dates for the specific year
  const easterDate = calculateEaster(year);
  const midsummerDate = calculateMidsummer(year);
  
  // Find Easter periods
  const easterPeriods = findEasterPeriods(easterDate);
  periods.push(...easterPeriods);
  
  // Find Midsummer periods
  const midsummerPeriods = findMidsummerPeriods(midsummerDate);
  periods.push(...midsummerPeriods);
  
  // Find Christmas and New Year periods
  const christmasPeriods = findChristmasPeriods(year);
  periods.push(...christmasPeriods);
  
  // Ascension Day - 40 days after Easter
  const ascensionDay = addDays(easterDate, 39);
  const ascensionStart = addDays(ascensionDay, -1);
  const ascensionEnd = addDays(ascensionDay, 3);
  
  const ascensionPeriod = {
    start: ascensionStart,
    end: ascensionEnd,
    days: differenceInDays(ascensionEnd, ascensionStart) + 1,
    vacationDaysNeeded: 1,
    description: "Kristi himmelsfärdshelg",
    score: 75,
    type: "bridge"
  };
  periods.push(ascensionPeriod);
  
  // Find specific holiday periods (efficient options around each holiday)
  const holidaySpecificPeriods = findHolidaySpecificPeriods(holidays);
  periods.push(...holidaySpecificPeriods);
  
  // Find periods around clusters of holidays that are close to each other
  const holidayClusterPeriods = findHolidayClusterPeriods(holidays);
  periods.push(...holidayClusterPeriods);
  
  return periods;
};
