
import { addDays, differenceInDays } from 'date-fns';
import { getMonthName, isDayOff } from '../helpers';
import { VacationPeriod } from '../types';

// Find extended weekends around regular weekends
export const findExtendedWeekends = (year: number, holidays: Date[]) => {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Create long weekends for each month
  for (let month = 0; month < 12; month++) {
    // Skip months that already have major holidays (handled elsewhere)
    if (month === 3 || month === 5 || month === 11 || month === 0) continue;
    
    // Look for good weekends to extend (every other weekend)
    for (let weekNumber = 1; weekNumber <= 4; weekNumber += 2) {
      const baseDate = new Date(year, month, weekNumber * 7);
      
      // Skip if in the past
      if (baseDate < today && baseDate.getFullYear() === today.getFullYear()) {
        continue;
      }
      
      // Find the closest weekend
      let currentDate = new Date(baseDate);
      while (currentDate.getDay() !== 5) { // 5 is Friday
        currentDate = addDays(currentDate, 1);
      }
      
      // Check that the date is still in the right month
      if (currentDate.getMonth() !== month) continue;
      
      // Thursday-Sunday extended weekend
      const thursdayStart = addDays(currentDate, -1); // Thursday
      const sundayEnd = addDays(currentDate, 2); // Sunday
      
      // Calculate vacation days needed
      let thurSunVacationDays = 0;
      const thurSunCurrentDay = new Date(thursdayStart);
      while (thurSunCurrentDay <= sundayEnd) {
        if (!isDayOff(thurSunCurrentDay, holidays)) {
          thurSunVacationDays++;
        }
        thurSunCurrentDay.setDate(thurSunCurrentDay.getDate() + 1);
      }
      
      // Calculate efficiency score and add bonus for efficient periods
      const thurSunEfficiency = 4 / Math.max(thurSunVacationDays, 1);
      const thurSunBonus = Math.floor((thurSunEfficiency - 1) * 15);
      
      const extendedWeekend: VacationPeriod = {
        start: thursdayStart,
        end: sundayEnd,
        days: differenceInDays(sundayEnd, thursdayStart) + 1,
        vacationDaysNeeded: thurSunVacationDays,
        description: `Långhelg i ${getMonthName(month)}`,
        score: 60 - Math.abs(6 - month) * 2 + thurSunBonus, // Higher score for summer/winter
        type: "weekend"
      };
      
      periods.push(extendedWeekend);
      
      // Friday-Monday extended weekend (different weekend than above)
      const fridayStart = addDays(currentDate, 7); // Friday next week
      const mondayEnd = addDays(fridayStart, 3); // Monday
      
      // Skip if outside the month
      if (fridayStart.getMonth() !== month) continue;
      
      // Calculate vacation days needed
      let friMonVacationDays = 0;
      const friMonCurrentDay = new Date(fridayStart);
      while (friMonCurrentDay <= mondayEnd) {
        if (!isDayOff(friMonCurrentDay, holidays)) {
          friMonVacationDays++;
        }
        friMonCurrentDay.setDate(friMonCurrentDay.getDate() + 1);
      }
      
      // Calculate efficiency score and add bonus for efficient periods
      const friMonEfficiency = 4 / Math.max(friMonVacationDays, 1);
      const friMonBonus = Math.floor((friMonEfficiency - 1) * 15);
      
      const fridayMondayWeekend: VacationPeriod = {
        start: fridayStart,
        end: mondayEnd,
        days: differenceInDays(mondayEnd, fridayStart) + 1,
        vacationDaysNeeded: friMonVacationDays,
        description: `Långhelg i ${getMonthName(month)}`,
        score: 58 - Math.abs(6 - month) * 2 + friMonBonus,
        type: "weekend"
      };
      
      periods.push(fridayMondayWeekend);
    }
  }
  
  return periods;
};
