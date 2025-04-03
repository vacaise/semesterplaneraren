
import { addDays, differenceInDays } from 'date-fns';
import { VacationPeriod } from '../types';
import { isDateInPast } from '../dateUtils';
import { calculateVacationDaysNeeded } from '../calculators';
import { generatePeriodDescription, determinePeriodType } from '../helpers';

// Find periods around holidays
export function findHolidayPeriods(
  year: number, 
  holidays: Date[]
): VacationPeriod[] {
  const holidayPeriods: VacationPeriod[] = [];
  
  // Filter out past holidays
  const futureHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Sort holidays chronologically
  futureHolidays.sort((a, b) => a.getTime() - b.getTime());
  
  // Find periods around each holiday
  futureHolidays.forEach(holiday => {
    // Look for periods starting up to 5 days before the holiday
    for (let daysBeforeHoliday = 0; daysBeforeHoliday <= 5; daysBeforeHoliday++) {
      const startDate = addDays(holiday, -daysBeforeHoliday);
      
      // Skip if start date is in the past
      if (isDateInPast(startDate)) continue;
      
      // Look for periods ending up to 5 days after the holiday
      for (let daysAfterHoliday = 0; daysAfterHoliday <= 5; daysAfterHoliday++) {
        const endDate = addDays(holiday, daysAfterHoliday);
        
        // Calculate vacation days needed
        const vacationDaysNeeded = calculateVacationDaysNeeded(startDate, endDate, holidays);
        
        // Skip periods that require no vacation days (already all holidays/weekends)
        if (vacationDaysNeeded === 0) continue;
        
        // Calculate total days in the period
        const totalDays = differenceInDays(endDate, startDate) + 1;
        
        // Calculate efficiency ratio (days off per vacation day)
        const efficiency = totalDays / vacationDaysNeeded;
        
        // Only consider periods with good efficiency
        if (efficiency >= 1.3) {
          const description = generatePeriodDescription(startDate, endDate);
          
          holidayPeriods.push({
            start: startDate,
            end: endDate,
            days: totalDays,
            vacationDaysNeeded,
            description,
            type: determinePeriodType(totalDays),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          });
        }
      }
    }
  });
  
  return holidayPeriods;
}
