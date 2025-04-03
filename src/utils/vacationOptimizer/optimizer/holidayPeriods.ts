
import { addDays } from 'date-fns';
import { createPeriod, getHolidayName, getMonthName } from './periodUtils';

// Generate periods around major holidays
export function generateHolidayPeriods(year: number, holidays: Date[]): any[] {
  const periods: any[] = [];
  const now = new Date();
  
  // For each holiday, create potential vacation periods around it
  holidays.forEach(holiday => {
    // Skip holidays in the past
    if (holiday < now) return;
    
    const holidayMonth = holiday.getMonth();
    const holidayName = getHolidayName(holiday, year);
    
    // Create various period lengths around this holiday
    [2, 3, 4, 5, 7, 9, 14].forEach(periodLength => {
      // Create period before the holiday
      const beforeStart = new Date(holiday);
      beforeStart.setDate(holiday.getDate() - (periodLength - 1));
      
      // Skip if start is in the past
      if (beforeStart >= now) {
        const beforePeriod = createPeriod(
          beforeStart, 
          holiday, 
          holidays,
          `${holidayName} ledighet`,
          "holiday"
        );
        periods.push(beforePeriod);
      }
      
      // Create period after the holiday
      const afterEnd = new Date(holiday);
      afterEnd.setDate(holiday.getDate() + (periodLength - 1));
      
      const afterPeriod = createPeriod(
        holiday, 
        afterEnd, 
        holidays,
        `${holidayName} ledighet`,
        "holiday"
      );
      periods.push(afterPeriod);
      
      // Create period centered on the holiday
      const centeredStart = new Date(holiday);
      centeredStart.setDate(holiday.getDate() - Math.floor(periodLength / 2));
      
      const centeredEnd = new Date(holiday);
      centeredEnd.setDate(holiday.getDate() + Math.floor(periodLength / 2));
      
      // Skip if start is in the past
      if (centeredStart >= now) {
        const centeredPeriod = createPeriod(
          centeredStart, 
          centeredEnd, 
          holidays,
          `${holidayName} ledighet`,
          "holiday"
        );
        periods.push(centeredPeriod);
      }
    });
  });
  
  return periods;
}
