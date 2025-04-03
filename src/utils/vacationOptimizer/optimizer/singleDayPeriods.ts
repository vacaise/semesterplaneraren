
import { addDays } from 'date-fns';
import { isDayOff } from '../helpers';
import { createPeriod } from './periodUtils';

/**
 * Generate single-day vacation periods
 * This is used as a fallback when other optimization strategies can't find
 * a perfect combination to match the exact vacation days needed.
 */
export function generateSingleDayPeriods(year: number, holidays: Date[]): any[] {
  const periods: any[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Go through each weekday in the year
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      // Skip if date is in the past or is already a day off (weekend or holiday)
      if (date < now || isDayOff(date, holidays)) {
        continue;
      }
      
      // Check if adjacent to a weekend or holiday for higher value
      const prevDay = new Date(date);
      prevDay.setDate(date.getDate() - 1);
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const adjacentToOffDay = isDayOff(prevDay, holidays) || isDayOff(nextDay, holidays);
      
      // Create a single-day period
      const period = createPeriod(
        date,
        date,
        holidays,
        `Ledig ${day}/${month + 1}`,
        adjacentToOffDay ? "extendedWeekend" : "singleDay"
      );
      
      // Adjust score based on whether it's adjacent to a day off
      if (adjacentToOffDay) {
        period.score = 60; // Higher score if extends a weekend or holiday
      } else {
        period.score = 30; // Lower score for random days
      }
      
      periods.push(period);
    }
  }
  
  return periods;
}
