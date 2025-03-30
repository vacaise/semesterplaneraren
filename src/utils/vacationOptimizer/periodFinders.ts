
import { addDays, differenceInDays } from 'date-fns';
import { calculateEaster, calculateMidsummer } from './dateCalculators';
import { getMonthName } from './helpers';

// Find important holiday periods
export const findKeyPeriods = (year: number, holidays: Date[]) => {
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

// Find bridge days between holidays and weekends
export const findBridgeDays = (year: number) => {
  const periods = [];
  
  // May Day (May 1)
  const mayFirst = new Date(year, 4, 1);
  const mayfirstDay = mayFirst.getDay();
  
  // If May 1 is close to a weekend, create a long weekend
  if (mayfirstDay === 1 || mayfirstDay === 2 || mayfirstDay === 4 || mayfirstDay === 5) {
    const mayFirstStart = mayfirstDay === 1 ? addDays(mayFirst, -3) : mayfirstDay === 2 ? addDays(mayFirst, -4) : mayFirst;
    const mayFirstEnd = mayfirstDay === 4 ? addDays(mayFirst, 3) : mayfirstDay === 5 ? addDays(mayFirst, 2) : mayFirst;
    
    const mayPeriod = {
      start: mayFirstStart,
      end: mayFirstEnd,
      days: differenceInDays(mayFirstEnd, mayFirstStart) + 1,
      vacationDaysNeeded: mayfirstDay === 1 ? 1 : mayfirstDay === 2 ? 1 : mayfirstDay === 4 ? 1 : mayfirstDay === 5 ? 1 : 0,
      description: "Första maj-helg",
      score: 70,
      type: "bridge"
    };
    
    periods.push(mayPeriod);
  }
  
  // National Day (June 6)
  const nationalDay = new Date(year, 5, 6);
  const nationalDayOfWeek = nationalDay.getDay();
  
  // If National Day is close to a weekend, create a long weekend
  if (nationalDayOfWeek === 1 || nationalDayOfWeek === 2 || nationalDayOfWeek === 4 || nationalDayOfWeek === 5) {
    const nationalDayStart = nationalDayOfWeek === 1 ? addDays(nationalDay, -3) : nationalDayOfWeek === 2 ? addDays(nationalDay, -4) : nationalDay;
    const nationalDayEnd = nationalDayOfWeek === 4 ? addDays(nationalDay, 3) : nationalDayOfWeek === 5 ? addDays(nationalDay, 2) : nationalDay;
    
    const nationalDayPeriod = {
      start: nationalDayStart,
      end: nationalDayEnd,
      days: differenceInDays(nationalDayEnd, nationalDayStart) + 1,
      vacationDaysNeeded: nationalDayOfWeek === 1 ? 1 : nationalDayOfWeek === 2 ? 1 : nationalDayOfWeek === 4 ? 1 : nationalDayOfWeek === 5 ? 1 : 0,
      description: "Nationaldagshelg",
      score: 68,
      type: "bridge"
    };
    
    periods.push(nationalDayPeriod);
  }
  
  // All Saints' Day (first Saturday in November)
  const allSaintsMonth = 10; // November
  let allSaintsDay = new Date(year, allSaintsMonth, 1);
  while (allSaintsDay.getDay() !== 6) { // 6 is Saturday
    allSaintsDay = addDays(allSaintsDay, 1);
  }
  
  // Create a long weekend around All Saints' Day
  const allSaintsStart = addDays(allSaintsDay, -2); // Thursday
  const allSaintsEnd = addDays(allSaintsDay, 1); // Sunday
  
  const allSaintsPeriod = {
    start: allSaintsStart,
    end: allSaintsEnd,
    days: differenceInDays(allSaintsEnd, allSaintsStart) + 1,
    vacationDaysNeeded: 1, // Friday
    description: "Alla helgons helg",
    score: 73,
    type: "bridge"
  };
  
  periods.push(allSaintsPeriod);
  
  return periods;
};

// Find extended weekends around regular weekends
export const findExtendedWeekends = (year: number) => {
  const periods = [];
  
  // Create long weekends for each month
  for (let month = 0; month < 12; month++) {
    // Skip months that already have major holidays
    if (month === 3 || month === 5 || month === 11 || month === 0) continue;
    
    // Look for good weekends to extend
    for (let weekNumber = 1; weekNumber <= 4; weekNumber++) {
      const baseDate = new Date(year, month, weekNumber * 7);
      
      // Find the closest weekend
      let currentDate = new Date(baseDate);
      while (currentDate.getDay() !== 5) { // 5 is Friday
        currentDate = addDays(currentDate, 1);
      }
      
      // Check that the date is still in the right month
      if (currentDate.getMonth() !== month) continue;
      
      const weekendStart = addDays(currentDate, -1); // Thursday
      const weekendEnd = addDays(currentDate, 3); // Monday
      
      const extendedWeekend = {
        start: weekendStart,
        end: weekendEnd,
        days: differenceInDays(weekendEnd, weekendStart) + 1,
        vacationDaysNeeded: 2, // Thursday, Friday or Monday
        description: `Långhelg i ${getMonthName(month)}`,
        score: 60 - Math.abs(6 - month) * 2, // Higher score for summer/winter
        type: "weekend"
      };
      
      periods.push(extendedWeekend);
      
      // One long weekend per month is enough
      break;
    }
  }
  
  return periods;
};

// Find summer vacation periods
export const findSummerPeriods = (year: number) => {
  const periods = [];
  
  // July vacation (3 weeks)
  const julyStart = new Date(year, 6, 1);
  const julyEnd = new Date(year, 6, 21);
  
  // Adjust to start and end on a good weekday
  let julyStartDate = new Date(julyStart);
  while (julyStartDate.getDay() !== 1) { // Start on a Monday
    julyStartDate = addDays(julyStartDate, 1);
  }
  
  let julyEndDate = new Date(julyEnd);
  while (julyEndDate.getDay() !== 0) { // End on a Sunday
    julyEndDate = addDays(julyEndDate, 1);
  }
  
  const julySummerPeriod = {
    start: julyStartDate,
    end: julyEndDate,
    days: differenceInDays(julyEndDate, julyStartDate) + 1,
    vacationDaysNeeded: 15,
    description: "Sommarsemester i juli",
    score: 82,
    type: "summer"
  };
  
  // August vacation (2 weeks)
  const augustStart = new Date(year, 7, 1);
  const augustEnd = new Date(year, 7, 14);
  
  // Adjust to start and end on a good weekday
  let augustStartDate = new Date(augustStart);
  while (augustStartDate.getDay() !== 1) { // Start on a Monday
    augustStartDate = addDays(augustStartDate, 1);
  }
  
  let augustEndDate = new Date(augustEnd);
  while (augustEndDate.getDay() !== 0) { // End on a Sunday
    augustEndDate = addDays(augustEndDate, 1);
  }
  
  const augustSummerPeriod = {
    start: augustStartDate,
    end: augustEndDate,
    days: differenceInDays(augustEndDate, augustStartDate) + 1,
    vacationDaysNeeded: 10,
    description: "Sommarsemester i augusti",
    score: 78,
    type: "summer"
  };
  
  periods.push(julySummerPeriod, augustSummerPeriod);
  return periods;
};

// Create extra periods for remaining vacation days
export const createExtraPeriods = (year: number, remainingDays: number) => {
  const extraPeriods = [];
  
  // Find a good period for winter break (February)
  const sportBreakStart = new Date(year, 1, 15);
  let sportBreakStartDate = new Date(sportBreakStart);
  while (sportBreakStartDate.getDay() !== 1) { // Start on a Monday
    sportBreakStartDate = addDays(sportBreakStartDate, 1);
  }
  
  const sportBreakEnd = addDays(sportBreakStartDate, remainingDays >= 5 ? 6 : remainingDays - 1);
  
  const winterPeriod = {
    start: sportBreakStartDate,
    end: sportBreakEnd,
    days: differenceInDays(sportBreakEnd, sportBreakStartDate) + 1,
    vacationDaysNeeded: Math.min(5, remainingDays),
    description: "Sportlov",
    score: 65,
    type: "winter"
  };
  
  // Create a fall break period
  const fallBreakStart = new Date(year, 9, 28); // End of October
  let fallBreakStartDate = new Date(fallBreakStart);
  while (fallBreakStartDate.getDay() !== 1) { // Start on a Monday
    fallBreakStartDate = addDays(fallBreakStartDate, 1);
  }
  
  const fallBreakEnd = addDays(fallBreakStartDate, Math.min(4, remainingDays));
  
  const fallPeriod = {
    start: fallBreakStartDate,
    end: fallBreakEnd,
    days: differenceInDays(fallBreakEnd, fallBreakStartDate) + 1,
    vacationDaysNeeded: Math.min(5, remainingDays),
    description: "Höstlov",
    score: 62,
    type: "fall"
  };
  
  // Add the most suitable period based on remaining days
  if (remainingDays >= 5) {
    extraPeriods.push(winterPeriod);
  } else {
    extraPeriods.push(fallPeriod);
  }
  
  return extraPeriods;
};
