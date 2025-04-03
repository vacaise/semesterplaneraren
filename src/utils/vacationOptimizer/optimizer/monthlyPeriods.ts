
import { addDays } from 'date-fns';
import { createPeriod, findDayInMonth, getMonthName } from './periodUtils';

// Generate weekly periods for each month
export function generateMonthlyWeeklyPeriods(year: number, holidays: Date[]): any[] {
  const periods: any[] = [];
  const now = new Date();
  
  // For each month, create different weekly options
  for (let month = 0; month < 12; month++) {
    // Find the first Monday of the month
    let firstMonday = findDayInMonth(year, month, 1, 1); // 1 = Monday
    
    // Create different period lengths (1 week, 2 weeks)
    [5, 7, 10, 14].forEach(periodLength => {
      for (let week = 0; week < 4; week++) {
        const startDate = new Date(firstMonday);
        startDate.setDate(firstMonday.getDate() + (week * 7));
        
        // Skip if start date is in the past
        if (startDate < now) continue;
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + periodLength - 1);
        
        // Skip if this period crosses into the next month too much
        if (endDate.getMonth() > month + 1) continue;
        
        const period = createPeriod(
          startDate,
          endDate,
          holidays,
          `${periodLength} dagars ${getMonthName(month)}-ledighet`,
          "week"
        );
        periods.push(period);
      }
    });
  }
  
  return periods;
}
