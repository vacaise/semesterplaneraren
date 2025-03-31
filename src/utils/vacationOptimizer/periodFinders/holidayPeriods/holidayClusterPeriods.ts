
import { addDays, differenceInDays } from 'date-fns';
import { VacationPeriod } from '../../types';

export const findHolidayClusterPeriods = (holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // First sort the holidays chronologically
  const sortedHolidays = [...holidays].sort((a, b) => a.getTime() - b.getTime());
  
  // Find clusters of holidays that are close to each other
  for (let i = 0; i < sortedHolidays.length - 1; i++) {
    const currentHoliday = sortedHolidays[i];
    const nextHoliday = sortedHolidays[i + 1];
    
    // Check if holidays are within 5 days of each other
    const daysBetween = differenceInDays(nextHoliday, currentHoliday);
    
    if (daysBetween > 0 && daysBetween <= 5) {
      // Create an extended period around these close holidays
      const clusterStart = addDays(currentHoliday, -2); // Start 2 days before first holiday
      const clusterEnd = addDays(nextHoliday, 2); // End 2 days after second holiday
      
      const clusterPeriod = {
        start: clusterStart,
        end: clusterEnd,
        days: differenceInDays(clusterEnd, clusterStart) + 1,
        vacationDaysNeeded: 5, // Just an estimate, will be calculated later
        description: "Röda dagar-kluster",
        score: 70,
        type: "holiday-cluster"
      };
      
      periods.push(clusterPeriod);
      
      // Add more efficient alternatives for the cluster
      // Option 1: Friday before first holiday to first holiday
      if (currentHoliday.getDay() > 1) { // If not Monday or Sunday
        const fridayBefore = new Date(currentHoliday);
        while (fridayBefore.getDay() !== 5) {
          fridayBefore.setDate(fridayBefore.getDate() - 1);
        }
        
        if (differenceInDays(currentHoliday, fridayBefore) <= 4) {
          const efficientStartPeriod = {
            start: fridayBefore,
            end: currentHoliday,
            days: differenceInDays(currentHoliday, fridayBefore) + 1,
            vacationDaysNeeded: 2, // Estimate, will be calculated properly later
            description: `Effektiv start till röd dag (${currentHoliday.getDate()}/${currentHoliday.getMonth() + 1})`,
            score: 78,
            type: "efficient-cluster"
          };
          periods.push(efficientStartPeriod);
        }
      }
      
      // Option 2: Last holiday to Sunday after
      if (nextHoliday.getDay() < 6) { // If not Saturday
        const sundayAfter = new Date(nextHoliday);
        while (sundayAfter.getDay() !== 0) {
          sundayAfter.setDate(sundayAfter.getDate() + 1);
        }
        
        if (differenceInDays(sundayAfter, nextHoliday) <= 4) {
          const efficientEndPeriod = {
            start: nextHoliday,
            end: sundayAfter,
            days: differenceInDays(sundayAfter, nextHoliday) + 1,
            vacationDaysNeeded: 2, // Estimate, will be calculated properly later
            description: `Effektivt slut efter röd dag (${nextHoliday.getDate()}/${nextHoliday.getMonth() + 1})`,
            score: 78,
            type: "efficient-cluster"
          };
          periods.push(efficientEndPeriod);
        }
      }
    }
  }
  
  // Add longer periods for holiday seasons
  for (let i = 0; i < sortedHolidays.length; i++) {
    const anchorHoliday = sortedHolidays[i];
    
    // Skip Christmas period as we already have it
    if (anchorHoliday.getMonth() === 11 && anchorHoliday.getDate() >= 22) continue;
    
    // Create a 12-day period centered around this holiday
    const longPeriodStart = addDays(anchorHoliday, -6);
    const longPeriodEnd = addDays(anchorHoliday, 5);
    
    // Count how many holidays are in this period
    let holidaysInPeriod = 0;
    for (const holiday of sortedHolidays) {
      if (holiday >= longPeriodStart && holiday <= longPeriodEnd) {
        holidaysInPeriod++;
      }
    }
    
    // Only add periods that include at least 2 holidays
    if (holidaysInPeriod >= 2) {
      const longPeriod = {
        start: longPeriodStart,
        end: longPeriodEnd,
        days: differenceInDays(longPeriodEnd, longPeriodStart) + 1,
        vacationDaysNeeded: 8, // Estimate, will be calculated properly later
        description: "Längre semesterperiod med röda dagar",
        score: 75 + (holidaysInPeriod * 5), // Score based on number of holidays included
        type: "extended-holiday"
      };
      
      periods.push(longPeriod);
    }
  }
  
  return periods;
};
