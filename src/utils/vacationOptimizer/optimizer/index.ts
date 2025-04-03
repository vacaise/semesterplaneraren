
import { VacationPeriod } from '../types';
import { scorePeriods } from '../scoringSystem';
import { generateHolidayPeriods } from './holidayPeriods';
import { generateBridgeDayPeriods } from './bridgeDayPeriods';
import { generateExtendedWeekendPeriods } from './weekendPeriods';
import { generateSummerPeriods } from './summerPeriods';
import { generateMonthlyWeeklyPeriods } from './monthlyPeriods';
import { generateCustomPeriods } from './customPeriods';
import { generateSingleDayPeriods } from './singleDayPeriods';
import { selectOptimalPeriods } from '../periodSelector';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): VacationPeriod[] => {
  console.log(`Starting optimization for ${year} with exactly ${vacationDays} vacation days and mode: ${mode}`);
  
  // Generate all potential vacation periods
  const allPeriods = generateAllPotentialPeriods(year, holidays, mode);
  console.log(`Generated ${allPeriods.length} potential periods`);
  
  // Try to select optimal periods that use EXACTLY the requested vacation days
  try {
    return selectOptimalPeriods(allPeriods, vacationDays, year, holidays, mode);
  } catch (error) {
    console.error("First optimization attempt failed:", error);
    
    // Generate custom periods specifically designed for the exact day count
    console.log("Generating custom periods for exact day count match...");
    const customPeriods = generateCustomPeriods(year, vacationDays, holidays);
    
    // Try again with the enhanced period set
    const enhancedPeriods = [...allPeriods, ...customPeriods];
    try {
      return selectOptimalPeriods(enhancedPeriods, vacationDays, year, holidays, mode);
    } catch (secondError) {
      // Last attempt - add single day periods
      console.error("Second optimization attempt failed:", secondError);
      console.log("Attempting final optimization with single-day periods...");
      
      const singleDayPeriods = generateSingleDayPeriods(year, holidays);
      const finalPeriods = [...enhancedPeriods, ...singleDayPeriods];
      
      // Final attempt
      return selectOptimalPeriods(finalPeriods, vacationDays, year, holidays, mode);
    }
  }
};

// Generate all potential vacation periods
function generateAllPotentialPeriods(
  year: number, 
  holidays: Date[], 
  mode: string
): VacationPeriod[] {
  const periods: VacationPeriod[] = [];
  
  // Add periods around major holidays
  periods.push(...generateHolidayPeriods(year, holidays));
  
  // Add bridge days between holidays and weekends
  periods.push(...generateBridgeDayPeriods(year, holidays));
  
  // Add extended weekend options
  periods.push(...generateExtendedWeekendPeriods(year, holidays));
  
  // Add summer vacation options
  periods.push(...generateSummerPeriods(year, holidays));
  
  // Add monthly weekly periods
  periods.push(...generateMonthlyWeeklyPeriods(year, holidays));
  
  // Score periods based on the optimization mode
  return scorePeriods(periods, mode);
}
