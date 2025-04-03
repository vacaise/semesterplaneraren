
import { addDays, differenceInDays } from 'date-fns';
import { calculateEaster, calculateMidsummer } from '../dateCalculators';
import { isDayOff } from '../helpers';

// Find important holiday periods
export const findKeyPeriods = (year: number, holidays: Date[]) => {
  const periods = [];
  
  // Calculate important dates for the specific year
  const easterDate = calculateEaster(year);
  const midsummerDate = calculateMidsummer(year);
  
  // Easter period with variants
  const easterThursday = addDays(easterDate, -3); // Maundy Thursday
  const easterMonday = addDays(easterDate, 1); // Easter Monday
  
  // Create multiple Easter period options to find the optimal one
  // Option 1: Extended before (starting from Monday/Tuesday before Easter)
  const extendedEasterStart1 = addDays(easterThursday, -3); // Monday before Easter
  const extendedEasterEnd1 = easterMonday;
  
  // Option 2: Extended after (ending Friday after Easter)
  const extendedEasterStart2 = easterThursday;
  const extendedEasterEnd2 = addDays(easterMonday, 4); // Friday after Easter
  
  // Option 3: Maximum extended (before and after)
  const extendedEasterStart3 = addDays(easterThursday, -3); // Monday before Easter
  const extendedEasterEnd3 = addDays(easterMonday, 4); // Friday after Easter
  
  // Calculate vacation days needed for each period option
  const calculateVacationDays = (start: Date, end: Date) => {
    let vacationDaysCount = 0;
    const currentDate = new Date(start);
    while (currentDate <= end) {
      if (!isDayOff(currentDate, holidays)) {
        vacationDaysCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return vacationDaysCount;
  };
  
  // Add all Easter period options
  periods.push({
    start: extendedEasterStart1,
    end: extendedEasterEnd1,
    days: differenceInDays(extendedEasterEnd1, extendedEasterStart1) + 1,
    vacationDaysNeeded: calculateVacationDays(extendedEasterStart1, extendedEasterEnd1),
    description: "Påskledighet - förlängd före",
    score: 85,
    type: "holiday"
  });
  
  periods.push({
    start: extendedEasterStart2,
    end: extendedEasterEnd2,
    days: differenceInDays(extendedEasterEnd2, extendedEasterStart2) + 1,
    vacationDaysNeeded: calculateVacationDays(extendedEasterStart2, extendedEasterEnd2),
    description: "Påskledighet - förlängd efter",
    score: 90,
    type: "holiday"
  });
  
  periods.push({
    start: extendedEasterStart3,
    end: extendedEasterEnd3,
    days: differenceInDays(extendedEasterEnd3, extendedEasterStart3) + 1,
    vacationDaysNeeded: calculateVacationDays(extendedEasterStart3, extendedEasterEnd3),
    description: "Påskledighet - maximalt förlängd",
    score: 95,
    type: "holiday"
  });
  
  // Midsummer period with more strategic options
  const midsummerStart = addDays(midsummerDate, -3); // A few days before Midsummer
  const midsummerEnd = addDays(midsummerDate, 5); // A few days after Midsummer
  
  const midsummerPeriod = {
    start: midsummerStart,
    end: midsummerEnd,
    days: differenceInDays(midsummerEnd, midsummerStart) + 1,
    vacationDaysNeeded: calculateVacationDays(midsummerStart, midsummerEnd),
    description: "Midsommarledighet",
    score: 85,
    type: "holiday"
  };
  
  // Christmas and New Year with more options for longer continuous breaks
  const christmasStart = new Date(year, 11, 20); // Earlier start
  const newYearsEnd = new Date(year, 0, 7);
  
  const christmasPeriod = {
    start: christmasStart,
    end: new Date(year, 11, 31),
    days: differenceInDays(new Date(year, 11, 31), christmasStart) + 1,
    vacationDaysNeeded: calculateVacationDays(christmasStart, new Date(year, 11, 31)),
    description: "Julledighet",
    score: 95,
    type: "holiday"
  };
  
  const newYearPeriod = {
    start: new Date(year, 0, 1),
    end: newYearsEnd,
    days: differenceInDays(newYearsEnd, new Date(year, 0, 1)) + 1,
    vacationDaysNeeded: calculateVacationDays(new Date(year, 0, 1), newYearsEnd),
    description: "Nyårsledighet",
    score: 90,
    type: "holiday"
  };
  
  // Combined Christmas and New Year period
  if (year > 1) { // Ensure we don't create invalid dates for the previous year
    const combinedWinterStart = new Date(year-1, 11, 20);
    const combinedWinterEnd = new Date(year, 0, 7);
    
    periods.push({
      start: combinedWinterStart,
      end: combinedWinterEnd,
      days: differenceInDays(combinedWinterEnd, combinedWinterStart) + 1,
      vacationDaysNeeded: calculateVacationDays(combinedWinterStart, combinedWinterEnd),
      description: "Jul- och nyårsledighet",
      score: 100,
      type: "holiday"
    });
  }
  
  // Ascension Day - 40 days after Easter with extended options
  const ascensionDay = addDays(easterDate, 39);
  
  // Option 1: Just the bridge day
  const ascensionStart1 = addDays(ascensionDay, -1);
  const ascensionEnd1 = addDays(ascensionDay, 3);
  
  // Option 2: Extended week
  const ascensionStart2 = addDays(ascensionDay, -4); // Monday
  const ascensionEnd2 = addDays(ascensionDay, 3); // Sunday
  
  periods.push({
    start: ascensionStart1,
    end: ascensionEnd1,
    days: differenceInDays(ascensionEnd1, ascensionStart1) + 1,
    vacationDaysNeeded: calculateVacationDays(ascensionStart1, ascensionEnd1),
    description: "Kristi himmelsfärdshelg",
    score: 80,
    type: "bridge"
  });
  
  periods.push({
    start: ascensionStart2,
    end: ascensionEnd2,
    days: differenceInDays(ascensionEnd2, ascensionStart2) + 1,
    vacationDaysNeeded: calculateVacationDays(ascensionStart2, ascensionEnd2),
    description: "Kristi himmelsfärdsvecka",
    score: 85,
    type: "bridge"
  });
  
  periods.push(midsummerPeriod, christmasPeriod, newYearPeriod);
  return periods;
};
