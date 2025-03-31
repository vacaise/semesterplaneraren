
import { addDays, differenceInDays } from 'date-fns';
import { VacationPeriod } from '../../types';

export const findMidsummerPeriods = (midsummerDate: Date): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Midsummer period
  const midsummerStart = addDays(midsummerDate, -3); // A few days before Midsummer
  const midsummerEnd = addDays(midsummerDate, 5); // A few days after Midsummer
  
  const midsummerPeriod = {
    start: midsummerStart,
    end: midsummerEnd,
    days: differenceInDays(midsummerEnd, midsummerStart) + 1,
    vacationDaysNeeded: 5,
    description: "Midsommarledighet",
    score: 80,
    type: "holiday"
  };
  
  // Create an alternative shorter midsummer period
  const shortMidsummerStart = addDays(midsummerDate, -3);
  const shortMidsummerEnd = addDays(midsummerDate, 2);
  
  const shortMidsummerPeriod = {
    start: shortMidsummerStart,
    end: shortMidsummerEnd,
    days: differenceInDays(shortMidsummerEnd, shortMidsummerStart) + 1,
    vacationDaysNeeded: 3, // Will be calculated properly later
    description: "Kort midsommarledighet",
    score: 75,
    type: "holiday"
  };
  
  periods.push(midsummerPeriod, shortMidsummerPeriod);
  return periods;
};
