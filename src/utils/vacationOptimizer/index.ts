
// Main entry point for the vacation optimizer
import { findOptimalSchedule } from './optimizer';
import { calculateTotalDaysOff } from './calculators';
import { isDayOff } from './helpers';

// Main export function for optimizing vacation
export const optimizeVacation = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
) => {
  // Find potential periods based on the parameters
  const selectedPeriods = findOptimalSchedule(year, vacationDays, holidays, mode);
  
  // Calculate the total number of days off
  let totalDaysOff = calculateTotalDaysOff(selectedPeriods, holidays);
  
  // Ensure totalDaysOff is not NaN
  if (isNaN(totalDaysOff)) {
    totalDaysOff = 0;
    console.error("totalDaysOff was NaN, setting to 0");
  }
  
  return {
    totalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: selectedPeriods
  };
};

export { isDayOff };
