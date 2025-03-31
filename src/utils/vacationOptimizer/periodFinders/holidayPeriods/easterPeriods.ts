
import { addDays, differenceInDays } from 'date-fns';
import { VacationPeriod } from '../../types';

export const findEasterPeriods = (easterDate: Date): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Easter period
  const easterThursday = addDays(easterDate, -3); // Maundy Thursday
  const easterMonday = addDays(easterDate, 1); // Easter Monday
  const extendedEasterStart = addDays(easterThursday, -1); // Day before Maundy Thursday
  const extendedEasterEnd = addDays(easterMonday, 3); // A few days after Easter weekend
  
  const easterPeriod = {
    start: extendedEasterStart,
    end: extendedEasterEnd,
    days: differenceInDays(extendedEasterEnd, extendedEasterStart) + 1,
    vacationDaysNeeded: 7, // Adjust based on holidays and weekends
    description: "Påskledighet",
    score: 85,
    type: "holiday"
  };
  
  // Also create an alternative shorter Easter period
  const shortEasterStart = addDays(easterThursday, -1);
  const shortEasterEnd = addDays(easterMonday, 1);
  
  const shortEasterPeriod = {
    start: shortEasterStart,
    end: shortEasterEnd,
    days: differenceInDays(shortEasterEnd, shortEasterStart) + 1,
    vacationDaysNeeded: 3, // Will be calculated properly later
    description: "Kort påskledighet",
    score: 80,
    type: "holiday"
  };
  
  periods.push(easterPeriod, shortEasterPeriod);
  return periods;
};
