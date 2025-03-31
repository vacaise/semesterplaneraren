
import { addDays, differenceInDays } from 'date-fns';
import { calculateEaster, calculateMidsummer } from '../dateCalculators';

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
  
  // NEW: Generate extended periods for important holiday clusters
  // Find clusters of holidays that are close to each other
  const sortedHolidays = [...holidays].sort((a, b) => a.getTime() - b.getTime());
  
  // Look for holiday clusters (holidays that are close to each other)
  for (let i = 0; i < sortedHolidays.length - 1; i++) {
    const currentHoliday = sortedHolidays[i];
    const nextHoliday = sortedHolidays[i + 1];
    
    // Check if holidays are within 5 days of each other
    const daysBetween = differenceInDays(nextHoliday, currentHoliday);
    
    if (daysBetween > 0 && daysBetween <= 5) {
      // Create an extended period around these close holidays
      const clusterStart = addDays(currentHoliday, -2); // Start 2 days before first holiday
      const clusterEnd = addDays(nextHoliday, 2); // End 2 days after second holiday
      
      const clusterPeriod = {
        start: clusterStart,
        end: clusterEnd,
        days: differenceInDays(clusterEnd, clusterStart) + 1,
        vacationDaysNeeded: 5, // Just an estimate, will be calculated later
        description: "Röda dagar-kluster",
        score: 70,
        type: "holiday-cluster"
      };
      
      periods.push(clusterPeriod);
    }
  }
  
  // Add longer periods for holiday seasons
  // Generate some longer holiday periods (10-14 days) that include multiple holidays
  for (let i = 0; i < sortedHolidays.length; i++) {
    const anchorHoliday = sortedHolidays[i];
    
    // Skip Christmas period as we already have it
    if (anchorHoliday.getMonth() === 11 && anchorHoliday.getDate() >= 22) continue;
    
    // Create a 12-day period centered around this holiday
    const longPeriodStart = addDays(anchorHoliday, -6);
    const longPeriodEnd = addDays(anchorHoliday, 5);
    
    // Count how many holidays are in this period
    let holidaysInPeriod = 0;
    for (const holiday of sortedHolidays) {
      if (holiday >= longPeriodStart && holiday <= longPeriodEnd) {
        holidaysInPeriod++;
      }
    }
    
    // Only add periods that include at least 2 holidays
    if (holidaysInPeriod >= 2) {
      const longPeriod = {
        start: longPeriodStart,
        end: longPeriodEnd,
        days: differenceInDays(longPeriodEnd, longPeriodStart) + 1,
        vacationDaysNeeded: 8, // Estimate, will be calculated properly later
        description: "Längre semesterperiod med röda dagar",
        score: 75 + (holidaysInPeriod * 5), // Score based on number of holidays included
        type: "extended-holiday"
      };
      
      periods.push(longPeriod);
    }
  }
  
  periods.push(easterPeriod, midsummerPeriod, christmasPeriod, newYearPeriod, ascensionPeriod);
  return periods;
};
