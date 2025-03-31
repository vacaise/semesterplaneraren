
import { differenceInDays } from 'date-fns';
import { VacationPeriod } from '../../types';

export const findChristmasPeriods = (year: number): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // 1. Standard Christmas period (Dec 22-31)
  const christmasStart = new Date(year, 11, 22);
  const newYearsEnd = new Date(year + 1, 0, 1);
  
  const christmasPeriod = {
    start: christmasStart,
    end: new Date(year, 11, 31),
    days: differenceInDays(new Date(year, 11, 31), christmasStart) + 1,
    vacationDaysNeeded: 3, // Will be calculated properly later
    description: "Julledighet",
    score: 90,
    type: "holiday"
  };
  
  // 2. Dec 23-Jan 1 (potentially more efficient by using Dec 30)
  const christmasAltStart = new Date(year, 11, 23);
  const christmasAltEnd = new Date(year + 1, 0, 1);
  
  const christmasAltPeriod = {
    start: christmasAltStart,
    end: christmasAltEnd,
    days: differenceInDays(christmasAltEnd, christmasAltStart) + 1,
    vacationDaysNeeded: 3, // Will be calculated properly later
    description: "Julledighet och nyår",
    score: 95,
    type: "holiday"
  };
  
  // 3. Dec 21-Jan 1 (includes weekend before Christmas)
  const extendedChristmasStart = new Date(year, 11, 21);
  const extendedChristmasEnd = new Date(year + 1, 0, 1);
  
  const extendedChristmasPeriod = {
    start: extendedChristmasStart,
    end: extendedChristmasEnd,
    days: differenceInDays(extendedChristmasEnd, extendedChristmasStart) + 1,
    vacationDaysNeeded: 4, // Will be calculated properly later
    description: "Förlängd julledighet med nyår",
    score: 92,
    type: "holiday"
  };
  
  // 4. Dec 20-Jan 1 (if Dec 20 is a Friday, this is even more efficient)
  const longChristmasStart = new Date(year, 11, 20);
  const longChristmasEnd = new Date(year + 1, 0, 1);
  
  const longChristmasPeriod = {
    start: longChristmasStart,
    end: longChristmasEnd,
    days: differenceInDays(longChristmasEnd, longChristmasStart) + 1,
    vacationDaysNeeded: 5, // Will be calculated properly later
    description: "Lång julledighet med nyår",
    score: 88,
    type: "holiday"
  };
  
  // 5. Optimal version Dec 22-Jan 1 med 30e december som semesterdag
  const optimalChristmasStart = new Date(year, 11, 22);
  const optimalChristmasEnd = new Date(year + 1, 0, 1); 
  
  const optimalChristmasPeriod = {
    start: optimalChristmasStart,
    end: optimalChristmasEnd, 
    days: differenceInDays(optimalChristmasEnd, optimalChristmasStart) + 1,
    vacationDaysNeeded: 4, // 23, 27, 28, 30 December - detta kommer beräknas korrekt senare
    description: "Optimal julledighet",
    score: 96, // Highest score for this optimal period
    type: "holiday"
  };
  
  // 6. A version that extends into early January
  const newYearPeriod = {
    start: new Date(year, 11, 27),
    end: new Date(year + 1, 0, 6), // Through Epiphany
    days: 11,
    vacationDaysNeeded: 5, // Will be calculated properly later
    description: "Nyårsledighet med trettonhelg",
    score: 94,
    type: "holiday"
  };
  
  // Adding special options for early January (Epiphany is Jan 6)
  const earlyJanuaryStart = new Date(year, 0, 2);
  const earlyJanuaryEnd = new Date(year, 0, 7);
  
  const earlyJanuaryPeriod = {
    start: earlyJanuaryStart,
    end: earlyJanuaryEnd,
    days: differenceInDays(earlyJanuaryEnd, earlyJanuaryStart) + 1,
    vacationDaysNeeded: 3, // Jan 2-3, 7
    description: "Trettondagsledighet",
    score: 85,
    type: "holiday"
  };
  
  periods.push(
    christmasPeriod,
    christmasAltPeriod,
    extendedChristmasPeriod,
    longChristmasPeriod,
    optimalChristmasPeriod,
    newYearPeriod,
    earlyJanuaryPeriod
  );
  
  return periods;
};
