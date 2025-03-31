
import { addDays, differenceInDays } from 'date-fns';
import { getMonthName } from '../helpers';

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
      
      // Standard Thursday-Monday extended weekend
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
      
      // NEW: Add ultra-efficient Friday-Monday weekend option
      // This gives 4 days off with just 1 vacation day
      const efficientWeekendStart = currentDate; // Friday
      const efficientWeekendEnd = addDays(currentDate, 3); // Monday
      
      const efficientWeekend = {
        start: efficientWeekendStart,
        end: efficientWeekendEnd,
        days: 4,
        vacationDaysNeeded: 1, // Just Monday
        description: `Effektiv långhelg i ${getMonthName(month)}`,
        score: 65 - Math.abs(6 - month) * 2, // Higher score for summer/winter
        type: "efficient-weekend"
      };
      
      periods.push(efficientWeekend);
      
      // NEW: Add Thursday-Sunday weekend option
      // This gives 4 days off with just 1 vacation day (Thursday)
      const thursdayWeekendStart = addDays(currentDate, -1); // Thursday
      const thursdayWeekendEnd = addDays(currentDate, 2); // Sunday
      
      const thursdayWeekend = {
        start: thursdayWeekendStart,
        end: thursdayWeekendEnd,
        days: 4,
        vacationDaysNeeded: 1, // Just Thursday
        description: `Effektiv torsdag-söndag i ${getMonthName(month)}`,
        score: 65 - Math.abs(6 - month) * 2, // Higher score for summer/winter
        type: "efficient-weekend"
      };
      
      periods.push(thursdayWeekend);
      
      // NEW: Add Wednesday-Sunday option for a 5-day break with 2 vacation days
      const wednesdayWeekendStart = addDays(currentDate, -2); // Wednesday
      const wednesdayWeekendEnd = addDays(currentDate, 2); // Sunday
      
      const wednesdayWeekend = {
        start: wednesdayWeekendStart,
        end: wednesdayWeekendEnd,
        days: 5,
        vacationDaysNeeded: 2, // Wednesday, Thursday
        description: `Förlängd helg (ons-sön) i ${getMonthName(month)}`,
        score: 62 - Math.abs(6 - month) * 2,
        type: "extended-weekend"
      };
      
      periods.push(wednesdayWeekend);
    }
  }
  
  return periods;
};
