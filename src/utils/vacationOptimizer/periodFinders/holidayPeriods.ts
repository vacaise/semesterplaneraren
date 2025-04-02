
import { addDays, differenceInDays } from 'date-fns';
import { calculateEaster, calculateMidsummer } from '../dateCalculators';

// Find important holiday periods
export const findKeyPeriods = (year: number, holidays: Date[], companyDays: Date[] = []) => {
  const periods = [];
  
  // Calculate important dates for the specific year
  const easterDate = calculateEaster(year);
  const midsummerDate = calculateMidsummer(year);
  
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
  
  // Christmas and New Year
  const christmasStart = new Date(year, 11, 22);
  const newYearsEnd = new Date(year, 0, 7);
  
  const christmasPeriod = {
    start: christmasStart,
    end: new Date(year, 11, 31),
    days: differenceInDays(new Date(year, 11, 31), christmasStart) + 1,
    vacationDaysNeeded: 3,
    description: "Julledighet",
    score: 90,
    type: "holiday"
  };
  
  const newYearPeriod = {
    start: new Date(year, 0, 1),
    end: newYearsEnd,
    days: differenceInDays(newYearsEnd, new Date(year, 0, 1)) + 1,
    vacationDaysNeeded: 3,
    description: "Nyårsledighet",
    score: 85,
    type: "holiday"
  };
  
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
  
  periods.push(easterPeriod, midsummerPeriod, christmasPeriod, newYearPeriod, ascensionPeriod);
  return periods;
};
