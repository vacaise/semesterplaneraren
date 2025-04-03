
import { addDays } from 'date-fns';
import { VacationPeriod } from '../types';
import { isDayOff, isDateInPast, getMonthName } from '../dateUtils';
import { calculateVacationDaysNeeded } from '../calculators';

// Find weekend extension periods
export function findWeekendExtensionPeriods(
  year: number, 
  holidays: Date[]
): VacationPeriod[] {
  const weekendPeriods: VacationPeriod[] = [];
  
  // Generate all Thursdays and Fridays in the year
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Skip if date is in the past
    if (isDateInPast(currentDate)) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    const dayOfWeek = currentDate.getDay();
    
    // Thursday (extend to Sunday)
    if (dayOfWeek === 4) {
      const thursdayDate = new Date(currentDate);
      const sundayDate = addDays(thursdayDate, 3);
      
      // If Friday isn't a holiday
      if (!isDayOff(addDays(thursdayDate, 1), holidays)) {
        const vacationDaysNeeded = calculateVacationDaysNeeded(thursdayDate, sundayDate, holidays);
        weekendPeriods.push({
          start: thursdayDate,
          end: sundayDate,
          days: 4,
          vacationDaysNeeded,
          description: `Långhelg i ${getMonthName(thursdayDate.getMonth())}`,
          type: "longweekend",
          startDate: thursdayDate.toISOString(),
          endDate: sundayDate.toISOString()
        });
      }
    }
    
    // Monday (extend from Friday)
    if (dayOfWeek === 1) {
      const mondayDate = new Date(currentDate);
      const fridayDate = addDays(mondayDate, -3);
      
      // Skip if in the past
      if (!isDateInPast(fridayDate)) {
        // If Monday isn't a holiday
        if (!isDayOff(mondayDate, holidays)) {
          const vacationDaysNeeded = calculateVacationDaysNeeded(fridayDate, mondayDate, holidays);
          weekendPeriods.push({
            start: fridayDate,
            end: mondayDate,
            days: 4,
            vacationDaysNeeded,
            description: `Långhelg i ${getMonthName(fridayDate.getMonth())}`,
            type: "longweekend",
            startDate: fridayDate.toISOString(),
            endDate: mondayDate.toISOString()
          });
        }
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return weekendPeriods;
}
