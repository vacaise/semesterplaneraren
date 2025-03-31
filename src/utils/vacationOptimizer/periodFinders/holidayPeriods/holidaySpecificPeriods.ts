
import { addDays } from 'date-fns';
import { VacationPeriod } from '../../types';

export const findHolidaySpecificPeriods = (holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Generate efficient alternatives around holidays
  // For each holiday, create efficient short breaks that maximize the days off to vacation days ratio
  const sortedHolidays = [...holidays].sort((a, b) => a.getTime() - b.getTime());
  
  for (const holiday of sortedHolidays) {
    const holidayDayOfWeek = holiday.getDay();
    
    // Skip weekends as they're already off
    if (holidayDayOfWeek === 0 || holidayDayOfWeek === 6) continue;
    
    // Create strategic periods around weekday holidays
    // For Monday holidays: Thursday before to Monday (4 days off, 1-2 vacation days)
    if (holidayDayOfWeek === 1) {
      const thursdayBefore = addDays(holiday, -4);
      const efficientPeriod = {
        start: thursdayBefore,
        end: holiday,
        days: 5,
        vacationDaysNeeded: 2, // Thursday, Friday
        description: `Lång helg med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 78,
        type: "efficient-holiday"
      };
      periods.push(efficientPeriod);
      
      // Also add Friday-Monday option (very efficient)
      const fridayBefore = addDays(holiday, -3);
      const shortEfficientPeriod = {
        start: fridayBefore, 
        end: holiday,
        days: 4,
        vacationDaysNeeded: 1, // Just Friday
        description: `Effektiv långhelg (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 82,
        type: "efficient-holiday"
      };
      periods.push(shortEfficientPeriod);
    }
    
    // For Friday holidays: Friday to Monday after (4 days off, 1 vacation day)
    if (holidayDayOfWeek === 5) {
      const mondayAfter = addDays(holiday, 3);
      const efficientPeriod = {
        start: holiday,
        end: mondayAfter,
        days: 4,
        vacationDaysNeeded: 1, // Just Monday
        description: `Effektiv långhelg (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 82,
        type: "efficient-holiday"
      };
      periods.push(efficientPeriod);
    }
    
    // For Tuesday holidays: Friday before to Tuesday (5 days off, 1 vacation day)
    if (holidayDayOfWeek === 2) {
      const fridayBefore = addDays(holiday, -4);
      const efficientPeriod = {
        start: fridayBefore,
        end: holiday,
        days: 5,
        vacationDaysNeeded: 1, // Just Monday
        description: `Effektiv långhelg (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 85,
        type: "efficient-holiday"
      };
      periods.push(efficientPeriod);
      
      // Also add option from Tuesday to Sunday (6 days off, 3 vacation days)
      const sundayAfter = addDays(holiday, 5);
      const weekExtensionPeriod = {
        start: holiday,
        end: sundayAfter, 
        days: 6,
        vacationDaysNeeded: 3, // Wed, Thu, Fri
        description: `Förlängd vecka med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 77,
        type: "efficient-holiday"
      };
      periods.push(weekExtensionPeriod);
    }
    
    // For Thursday holidays: Thursday to Sunday (4 days off, 1 vacation day)
    if (holidayDayOfWeek === 4) {
      const sundayAfter = addDays(holiday, 3);
      const efficientPeriod = {
        start: holiday,
        end: sundayAfter,
        days: 4,
        vacationDaysNeeded: 1, // Just Friday
        description: `Effektiv långhelg (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 82,
        type: "efficient-holiday"
      };
      periods.push(efficientPeriod);
      
      // Also add Monday to Thursday (4 days off, 3 vacation days)
      const mondayBefore = addDays(holiday, -3);
      const weekStartPeriod = {
        start: mondayBefore,
        end: holiday,
        days: 4,
        vacationDaysNeeded: 3, // Mon, Tue, Wed
        description: `Kort vecka med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 73,
        type: "efficient-holiday"
      };
      periods.push(weekStartPeriod);
    }
    
    // For Wednesday holidays: create both before and after periods
    if (holidayDayOfWeek === 3) {
      // Monday-Wednesday (3 days off, 2 vacation days)
      const mondayBefore = addDays(holiday, -2);
      const firstHalfPeriod = {
        start: mondayBefore,
        end: holiday,
        days: 3,
        vacationDaysNeeded: 2, // Mon, Tue
        description: `Halv vecka med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 75,
        type: "efficient-holiday"
      };
      periods.push(firstHalfPeriod);
      
      // Wednesday-Sunday (5 days off, 2 vacation days)
      const sundayAfter = addDays(holiday, 4);
      const secondHalfPeriod = {
        start: holiday,
        end: sundayAfter,
        days: 5,
        vacationDaysNeeded: 2, // Thu, Fri
        description: `Förlängd helg med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 80,
        type: "efficient-holiday"
      };
      periods.push(secondHalfPeriod);
      
      // Friday before to Sunday after (9 days off, 4 vacation days)
      const fridayBefore = addDays(holiday, -5);
      const extendedPeriod = {
        start: fridayBefore,
        end: sundayAfter,
        days: 9,
        vacationDaysNeeded: 4, // Mon, Tue, Thu, Fri
        description: `Effektiv 9-dagarsledighet (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 83,
        type: "efficient-holiday"
      };
      periods.push(extendedPeriod);
    }
  }
  
  return periods;
};
