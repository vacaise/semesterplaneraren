
import { isDateInPast } from './helpers';
import { VacationPeriod } from './types';

/**
 * Handles vacation periods that have dates in the past
 */

/**
 * Filters out periods that are entirely in the past
 * @param periods Array of vacation periods to filter
 * @returns Array of periods that end in the future
 */
export const filterPastPeriods = (periods: VacationPeriod[]): VacationPeriod[] => {
  return periods.filter(period => {
    const endDate = new Date(period.end);
    // Skip periods that have completely passed
    return !isDateInPast(endDate);
  });
};

/**
 * Adjusts the start date of periods that start in the past but end in the future
 * Sets the start date to today and recalculates the number of days
 * @param periods Array of vacation periods to adjust
 * @returns Array of adjusted periods (periods shorter than 2 days are filtered out)
 */
export const adjustPartialPastPeriods = (periods: VacationPeriod[]): VacationPeriod[] => {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  
  const adjustedPeriods = periods.map(period => {
    const startDate = new Date(period.start);
    
    if (isDateInPast(startDate)) {
      // Create a new period object to avoid mutating the original
      const newPeriod = { ...period };
      newPeriod.start = new Date(todayDate);
      
      // Recalculate days based on the new start date
      const endDate = new Date(period.end);
      newPeriod.days = Math.floor((endDate.getTime() - newPeriod.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      return newPeriod;
    }
    
    return period;
  });
  
  // Remove periods that became too short after adjustment (less than 2 days)
  return adjustedPeriods.filter(period => period.days >= 2);
};

/**
 * Processes periods to handle past dates
 * First filters out periods entirely in the past, then adjusts periods that start in the past
 * @param periods Array of vacation periods
 * @returns Array of filtered and adjusted periods
 */
export const processPastDates = (periods: VacationPeriod[]): VacationPeriod[] => {
  const filteredPeriods = filterPastPeriods(periods);
  return adjustPartialPastPeriods(filteredPeriods);
};
