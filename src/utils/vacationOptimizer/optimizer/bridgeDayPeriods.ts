
import { addDays } from 'date-fns';
import { isDayOff } from '../helpers';
import { createPeriod, getMonthName } from './periodUtils';

// Generate bridge day periods (filling gaps between holidays/weekends)
export function generateBridgeDayPeriods(year: number, holidays: Date[]): any[] {
  const periods: any[] = [];
  const now = new Date();
  
  // Find potential bridge days (days between holidays/weekends)
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const currentDate = new Date(year, month, day);
      
      // Skip dates in the past
      if (currentDate < now) continue;
      
      // Check if this is a work day
      if (!isDayOff(currentDate, holidays)) {
        // Check if both the previous and next day are days off
        const prevDay = new Date(currentDate);
        prevDay.setDate(currentDate.getDate() - 1);
        
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        
        const isPrevDayOff = isDayOff(prevDay, holidays);
        const isNextDayOff = isDayOff(nextDay, holidays);
        
        // If it's surrounded by days off, it's a bridge day
        if (isPrevDayOff && isNextDayOff) {
          // Create a period for this bridge day
          const period = createPeriod(
            currentDate,
            currentDate,
            holidays,
            `Klämdag ${getMonthName(month)}`,
            "bridge"
          );
          
          // Give bridge days a high score (very efficient)
          period.score = 80;
          periods.push(period);
          
          // Also create extended periods around this bridge day
          const extendedStart = new Date(prevDay);
          extendedStart.setDate(prevDay.getDate() - 2); // Include more days
          
          const extendedEnd = new Date(nextDay);
          extendedEnd.setDate(nextDay.getDate() + 2);
          
          if (extendedStart >= now) {
            const extendedPeriod = createPeriod(
              extendedStart,
              extendedEnd,
              holidays,
              `Förlängd klämdag ${getMonthName(month)}`,
              "bridge"
            );
            extendedPeriod.score = 75;
            periods.push(extendedPeriod);
          }
        }
      }
    }
  }
  
  return periods;
}
