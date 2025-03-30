
import { isDateInPast } from './helpers';

// Filter out periods that are entirely in the past
export const filterPastPeriods = (periods: any[]) => {
  return periods.filter(period => {
    const endDate = new Date(period.end);
    // Skip periods that have completely passed
    return !isDateInPast(endDate);
  });
};

// Adjust periods that start in the past but end in the future
export const adjustPartialPastPeriods = (periods: any[]) => {
  const adjustedPeriods = periods.map(period => {
    const startDate = new Date(period.start);
    if (isDateInPast(startDate)) {
      // Set start date to today
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const newPeriod = { ...period };
      newPeriod.start = new Date(todayDate);
      
      // Recalculate days based on the new start date
      const endDate = new Date(period.end);
      newPeriod.days = Math.floor((endDate.getTime() - newPeriod.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      return newPeriod;
    }
    return period;
  });
  
  // Remove periods that became too short after adjustment
  return adjustedPeriods.filter(period => period.days >= 2);
};
