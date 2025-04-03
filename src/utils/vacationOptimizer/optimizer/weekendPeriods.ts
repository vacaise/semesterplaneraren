
import { addDays } from 'date-fns';
import { createPeriod, findDayInMonth, getMonthName } from './periodUtils';

// Generate extended weekend periods
export function generateExtendedWeekendPeriods(year: number, holidays: Date[]): any[] {
  const periods: any[] = [];
  const now = new Date();
  
  // For each month, create extended weekend options
  for (let month = 0; month < 12; month++) {
    for (let week = 1; week <= 4; week++) {
      // Try creating a Thursday-Monday extended weekend
      const thursday = findDayInMonth(year, month, week, 4); // Thursday is 4
      
      if (thursday < now) continue;
      
      const monday = new Date(thursday);
      monday.setDate(thursday.getDate() + 4); // Monday after this Thursday
      
      const thursdayToMonday = createPeriod(
        thursday,
        monday,
        holidays,
        `Långhelg i ${getMonthName(month)}`,
        "weekend"
      );
      periods.push(thursdayToMonday);
      
      // Also create Friday-Monday (3-day weekend)
      const friday = new Date(thursday);
      friday.setDate(thursday.getDate() + 1);
      
      if (friday >= now) {
        const fridayToMonday = createPeriod(
          friday,
          monday,
          holidays,
          `Helgledighet ${getMonthName(month)}`,
          "weekend"
        );
        periods.push(fridayToMonday);
      }
    }
  }
  
  return periods;
}
