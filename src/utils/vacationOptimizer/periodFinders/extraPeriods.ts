
import { addDays, differenceInDays } from 'date-fns';
import { isDayOff, getMonthName } from '../helpers';
import { VacationPeriod } from '../types';

// Create extra periods to fill in gaps
export const createExtraPeriods = (year: number, holidays: Date[], companyDays: Date[] = []): VacationPeriod[] => {
  const extraPeriods: VacationPeriod[] = [];
  
  // Add single-day periods
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const date = new Date(year, month, day);
      
      // Skip weekends, holidays, and company days
      if (isDayOff(date, holidays, companyDays)) continue;
      
      // Check if this date creates a mini-break with a weekend or holiday
      const dayBefore = new Date(date);
      dayBefore.setDate(date.getDate() - 1);
      
      const dayAfter = new Date(date);
      dayAfter.setDate(date.getDate() + 1);
      
      // If the day before or after is a day off, it creates a mini-break
      if (isDayOff(dayBefore, holidays, companyDays) || isDayOff(dayAfter, holidays, companyDays)) {
        const miniBreak = {
          start: date,
          end: date,
          days: 1,
          vacationDaysNeeded: 1,
          description: `Extra dag i ${getMonthName(month)}`,
          type: "single",
          score: 30
        };
        
        extraPeriods.push(miniBreak);
      }
    }
  }
  
  // Add strategic random days - this is for filling gaps in vacation plans
  const strategicMonths = [1, 4, 9, 10]; // February, May, October, November
  
  strategicMonths.forEach(month => {
    // Try to find a Thursday (good for creating a long weekend)
    for (let day = 15; day < 22; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === 4) { // Thursday
        if (!isDayOff(date, holidays, companyDays)) {
          extraPeriods.push({
            start: date,
            end: date,
            days: 1,
            vacationDaysNeeded: 1,
            description: `Strategisk torsdag i ${getMonthName(month)}`,
            type: "strategic",
            score: 35
          });
        }
        break;
      }
    }
    
    // Try to find a Monday (also good for long weekends)
    for (let day = 8; day < 15; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === 1) { // Monday
        if (!isDayOff(date, holidays, companyDays)) {
          extraPeriods.push({
            start: date,
            end: date,
            days: 1,
            vacationDaysNeeded: 1,
            description: `Strategisk måndag i ${getMonthName(month)}`,
            type: "strategic",
            score: 35
          });
        }
        break;
      }
    }
  });
  
  return extraPeriods;
};
