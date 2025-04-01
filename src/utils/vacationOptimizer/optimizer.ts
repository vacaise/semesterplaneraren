
import { addDays, differenceInDays, format, isSameDay } from 'date-fns';
import { VacationPeriod, OptimizationMode } from './types';
import { isDayOff } from './helpers';
import { selectOptimalPeriods } from './periodSelector';
import { findKeyPeriods, findBridgeDays, findExtendedWeekends, findSummerPeriods } from './periodFinders';
import { scorePeriods } from './scoringSystem';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): VacationPeriod[] => {
  // Generate all possible periods by scanning the year
  const allPossiblePeriods = generatePossiblePeriods(year, holidays);
  
  // Score and prioritize periods based on the selected mode
  const scoredPeriods = scorePeriods(allPossiblePeriods, mode);
  
  // Select the optimal combination of periods
  return selectOptimalPeriods(scoredPeriods, vacationDays, year, holidays, mode);
};

// Generate all possible vacation periods around holidays and weekends
const generatePossiblePeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // 1. Find periods around major holidays (Easter, Christmas, Midsummer, etc.)
  periods.push(...findKeyPeriods(year, holidays));
  
  // 2. Find bridge days between holidays and weekends
  periods.push(...findBridgeDays(year));
  
  // 3. Find extended weekends (Thursday-Sunday or Friday-Monday)
  periods.push(...findExtendedWeekends(year, holidays));
  
  // 4. Find summer vacation options
  periods.push(...findSummerPeriods(year));
  
  return periods;
};
