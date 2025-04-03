
import { addDays } from 'date-fns';
import { createPeriod, getMonthName } from './periodUtils';

// Generate summer vacation periods
export function generateSummerPeriods(year: number, holidays: Date[]): any[] {
  const periods: any[] = [];
  const now = new Date();
  
  // Define summer months (June - August)
  const summerMonths = [5, 6, 7]; // 0-indexed months
  
  // Generate different length vacation periods during summer
  summerMonths.forEach(month => {
    // Skip if current month is already past
    const monthDate = new Date(year, month, 15);
    if (monthDate < now && monthDate.getFullYear() === now.getFullYear()) return;
    
    // Create weekly periods throughout the month
    for (let startDay = 1; startDay <= 22; startDay += 7) {
      [7, 14, 21].forEach(periodLength => {
        const startDate = new Date(year, month, startDay);
        
        // Skip if start date is in the past
        if (startDate < now) return;
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + periodLength - 1);
        
        // Create the summer period
        const summerPeriod = createPeriod(
          startDate,
          endDate,
          holidays,
          `${periodLength} dagars ${getMonthName(month)}-semester`,
          "summer"
        );
        
        // Give summer periods a higher score
        summerPeriod.score = 70 + periodLength / 3;
        periods.push(summerPeriod);
      });
    }
  });
  
  return periods;
}
