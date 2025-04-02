
import { addDays, differenceInDays } from 'date-fns';
import { getMonthName } from '../helpers';

// Find extended weekends around regular weekends
export const findExtendedWeekends = (year: number, holidays: Date[] = [], companyDays: Date[] = []) => {
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
