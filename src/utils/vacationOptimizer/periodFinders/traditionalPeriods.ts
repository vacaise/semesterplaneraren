
import { addDays } from 'date-fns';
import { VacationPeriod } from '../types';
import { isDateInPast, getMonthName, calculateVacationDaysNeeded } from '../calculators';
import { determinePeriodType } from '../helpers';

// Find traditional vacation periods (summer, winter, etc.)
export function findTraditionalVacationPeriods(
  year: number, 
  holidays: Date[]
): VacationPeriod[] {
  const regularPeriods: VacationPeriod[] = [];
  
  // Summer vacation options
  const summerMonths = [6, 7]; // July and August
  
  summerMonths.forEach(month => {
    for (let weekStartDay = 1; weekStartDay <= 22; weekStartDay += 7) {
      const startDate = new Date(year, month, weekStartDay);
      
      // Skip if in the past
      if (isDateInPast(startDate)) continue;
      
      // Find start of week (Monday)
      const adjustedStartDate = new Date(startDate);
      while (adjustedStartDate.getDay() !== 1) {
        adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
      }
      
      // Create options for 1, 2, and 3-week vacations
      [6, 13, 20].forEach(daysToAdd => {
        const endDate = addDays(adjustedStartDate, daysToAdd);
        const vacationDaysNeeded = calculateVacationDaysNeeded(adjustedStartDate, endDate, holidays);
        const totalDays = daysToAdd + 1;
        
        regularPeriods.push({
          start: adjustedStartDate,
          end: endDate,
          days: totalDays,
          vacationDaysNeeded,
          description: `Sommarsemester i ${getMonthName(adjustedStartDate.getMonth())}`,
          type: determinePeriodType(totalDays),
          startDate: adjustedStartDate.toISOString(),
          endDate: endDate.toISOString()
        });
      });
    }
  });
  
  // Other seasonal vacation options
  const otherMonths = [1, 2, 3, 4, 5, 8, 9, 10, 11]; // Feb-June, Sept-Dec
  
  otherMonths.forEach(month => {
    // Add one week option in the middle of each month
    const startDate = new Date(year, month, 15);
    
    // Skip if in the past
    if (isDateInPast(startDate)) return;
    
    // Find start of week (Monday)
    const adjustedStartDate = new Date(startDate);
    while (adjustedStartDate.getDay() !== 1) {
      adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
    }
    
    const endDate = addDays(adjustedStartDate, 6); // One week
    const vacationDaysNeeded = calculateVacationDaysNeeded(adjustedStartDate, endDate, holidays);
    
    let description = "";
    if (month === 1) description = "Sportlov";
    else if (month === 2 || month === 3) description = "Vårlov";
    else if (month === 9 || month === 10) description = "Höstlov";
    else if (month === 11) description = "Julledighet";
    else description = `Ledighet i ${getMonthName(month)}`;
    
    regularPeriods.push({
      start: adjustedStartDate,
      end: endDate,
      days: 7,
      vacationDaysNeeded,
      description,
      type: "week",
      startDate: adjustedStartDate.toISOString(),
      endDate: endDate.toISOString()
    });
  });
  
  return regularPeriods;
}
