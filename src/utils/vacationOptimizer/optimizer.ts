import { addDays, differenceInDays, format, isSameDay } from 'date-fns';
import { VacationPeriod, OptimizationMode } from './types';
import { isDayOff } from './helpers';
import { selectOptimalPeriods } from './periodSelector';
import { findKeyPeriods, findBridgeDays, findExtendedWeekends, findSummerPeriods, createExtraPeriods } from './periodFinders';
import { scorePeriods } from './scoringSystem';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): VacationPeriod[] => {
  console.log(`Starting optimization for ${year} with ${vacationDays} vacation days and mode: ${mode}`);
  
  // Generate all possible periods by scanning the year
  const allPossiblePeriods = generatePossiblePeriods(year, holidays);
  
  // Score and prioritize periods based on the selected mode
  const scoredPeriods = scorePeriods(allPossiblePeriods, mode);
  
  // Generate additional periods to fill in gaps and maximize total time off
  const extraPeriods = createExtraPeriods(year, holidays);
  const allPeriods = [...scoredPeriods, ...extraPeriods];
  
  // Try to select the optimal combination of periods using EXACTLY the requested vacation days
  try {
    console.log(`Attempting to find optimal schedule with exactly ${vacationDays} vacation days`);
    return selectOptimalPeriods(allPeriods, vacationDays, year, holidays, mode);
  } catch (error) {
    console.error("Failed to find optimal schedule:", error);
    
    // If we couldn't find an exact match, generate more custom periods that match the day count
    console.log("Generating custom periods for exact vacation day count...");
    const customPeriods = generateCustomPeriodsForExactDays(year, vacationDays, holidays);
    
    // Try again with the custom periods added
    const enhancedPeriods = [...allPeriods, ...customPeriods];
    try {
      return selectOptimalPeriods(enhancedPeriods, vacationDays, year, holidays, mode);
    } catch (secondError) {
      console.error("Failed second attempt:", secondError);
      
      // Last resort: try to generate individual day periods
      const singleDayPeriods = generateSingleDayPeriods(year, holidays);
      const finalAttemptPeriods = [...enhancedPeriods, ...singleDayPeriods];
      
      // Final attempt
      return selectOptimalPeriods(finalAttemptPeriods, vacationDays, year, holidays, mode);
    }
  }
};

// Generate all possible vacation periods around holidays and weekends
const generatePossiblePeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // 1. Find periods around major holidays (Easter, Christmas, Midsummer, etc.)
  periods.push(...findKeyPeriods(year, holidays));
  
  // 2. Find bridge days between holidays and weekends
  periods.push(...findBridgeDays(year));
  
  // 3. Find extended weekends (Thursday-Sunday or Friday-Monday)
  periods.push(...findExtendedWeekends(year));
  
  // 4. Find summer vacation options
  periods.push(...findSummerPeriods(year));
  
  // 5. Generate more possible combinations to increase efficiency
  const additionalPeriods = generateAdditionalPeriods(year, holidays);
  periods.push(...additionalPeriods);
  
  return periods;
};

// Generate custom periods specifically designed to use exactly the requested vacation days
const generateCustomPeriodsForExactDays = (
  year: number, 
  exactVacationDays: number,
  holidays: Date[]
): VacationPeriod[] => {
  console.log(`Generating custom periods for exactly ${exactVacationDays} vacation days`);
  const customPeriods: VacationPeriod[] = [];
  
  // Create periods that start on Mondays and have exactly the requested vacation days
  // Try different starting points throughout the year
  const startMonths = [5, 6, 7, 8, 9, 10, 3, 4, 1, 2, 11, 0]; // Prioritize summer months
  
  for (const month of startMonths) {
    for (let day = 1; day <= 28; day += 7) { // Try different starting days
      const startDate = new Date(year, month, day);
      
      // Find next Monday
      while (startDate.getDay() !== 1) {
        startDate.setDate(startDate.getDate() + 1);
      }
      
      // Skip if in the past
      const now = new Date();
      if (startDate < now) continue;
      
      let vacationDaysCount = 0;
      let totalDays = 0;
      let currentDate = new Date(startDate);
      
      // Keep extending the period until we reach exactly the requested vacation days
      while (vacationDaysCount < exactVacationDays) {
        if (!isDayOff(currentDate, holidays)) {
          vacationDaysCount++;
        }
        
        totalDays++;
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Set a reasonable limit to prevent infinite loops
        if (totalDays > 50) break;
      }
      
      // If we got exactly the requested number of vacation days
      if (vacationDaysCount === exactVacationDays) {
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() - 1); // Adjust to last day
        
        customPeriods.push({
          start: new Date(startDate),
          end: new Date(endDate),
          days: totalDays,
          vacationDaysNeeded: exactVacationDays,
          description: `${exactVacationDays} dagars semester ${getMonthName(startDate.getMonth())}`,
          type: "custom",
          score: 70 // Higher score for exact matches
        });
      }
    }
  }
  
  // Try to create shorter periods that can be combined
  if (exactVacationDays <= 15 && exactVacationDays > 1) {
    for (let splitSize = 1; splitSize <= Math.min(exactVacationDays - 1, 5); splitSize++) {
      const remainingDays = exactVacationDays - splitSize;
      
      // Create custom periods with this split
      for (const month of startMonths) {
        for (let day = 1; day <= 21; day += 5) {
          const startDate = new Date(year, month, day);
          
          // Skip if in the past
          if (startDate < new Date()) continue;
          
          let vacationDaysCount = 0;
          let totalDays = 0;
          let currentDate = new Date(startDate);
          
          // Count until we reach exactly splitSize vacation days
          while (vacationDaysCount < splitSize) {
            if (!isDayOff(currentDate, holidays)) {
              vacationDaysCount++;
            }
            
            totalDays++;
            currentDate.setDate(currentDate.getDate() + 1);
            
            if (totalDays > 20) break; // Safety limit
          }
          
          // If we got exactly the requested split size
          if (vacationDaysCount === splitSize) {
            const endDate = new Date(currentDate);
            endDate.setDate(currentDate.getDate() - 1); // Adjust to last day
            
            customPeriods.push({
              start: new Date(startDate),
              end: new Date(endDate),
              days: totalDays,
              vacationDaysNeeded: splitSize,
              description: `${splitSize} dagars semester ${getMonthName(startDate.getMonth())}`,
              type: "split",
              score: 65
            });
          }
        }
      }
    }
  }
  
  // Try to create 1-day periods that can be combined to reach the exact count
  if (exactVacationDays <= 10) {
    const singleDayPeriods = generateSingleDayPeriods(year, holidays);
    customPeriods.push(...singleDayPeriods);
  }
  
  console.log(`Generated ${customPeriods.length} custom periods for exact vacation day count`);
  return customPeriods;
};

// Generate single day periods for more flexibility
const generateSingleDayPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const singleDayPeriods: VacationPeriod[] = [];
  
  // Create single day vacations on strategic days (like Fridays or Mondays)
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const date = new Date(year, month, day);
      
      // Only consider work days
      if (isDayOff(date, holidays)) continue;
      
      // Skip if in the past
      if (date < new Date()) continue;
      
      // Prioritize Fridays and Mondays
      const dayScore = date.getDay() === 1 || date.getDay() === 5 ? 55 : 40;
      
      singleDayPeriods.push({
        start: new Date(date),
        end: new Date(date),
        days: 1,
        vacationDaysNeeded: 1,
        description: `Ledig ${date.getDate()} ${getMonthName(month)}`,
        type: "single",
        score: dayScore
      });
    }
  }
  
  return singleDayPeriods;
};

// Generate additional vacation period options to maximize efficiency
const generateAdditionalPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const additionalPeriods: VacationPeriod[] = [];
  
  // Add week-long options focusing on months with higher holiday density
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  months.forEach(month => {
    // Create a week-long period in the middle of each month
    const startDay = new Date(year, month - 1, 15);
    
    // Find the next Monday
    while (startDay.getDay() !== 1) {
      startDay.setDate(startDay.getDate() + 1);
    }
    
    const endDay = new Date(startDay);
    endDay.setDate(startDay.getDate() + 6); // Sunday
    
    // Calculate vacation days needed (excluding weekends and holidays)
    let vacationDaysNeeded = 0;
    const currentDay = new Date(startDay);
    
    while (currentDay <= endDay) {
      if (!isDayOff(currentDay, holidays)) {
        vacationDaysNeeded++;
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    additionalPeriods.push({
      start: new Date(startDay),
      end: new Date(endDay),
      days: 7,
      vacationDaysNeeded,
      description: `${month}-veckan`,
      type: "week",
      score: 50
    });
    
    // Also add mini-breaks (Thursday-Sunday)
    const thursdayDate = new Date(year, month - 1, 1);
    // Find the first Thursday of the month
    while (thursdayDate.getDay() !== 4) {
      thursdayDate.setDate(thursdayDate.getDate() + 1);
    }
    
    // Add 2 Thursday-Sunday mini-breaks per month
    for (let i = 0; i < 2; i++) {
      const thurStart = new Date(thursdayDate);
      thurStart.setDate(thursdayDate.getDate() + (i * 14)); // Every other Thursday
      
      const thurEnd = new Date(thurStart);
      thurEnd.setDate(thurStart.getDate() + 3); // Sunday
      
      // Skip if in the past
      const today = new Date();
      if (thurEnd < today) continue;
      
      // Calculate vacation days needed
      let miniBreakDaysNeeded = 0;
      const currentMiniDay = new Date(thurStart);
      
      while (currentMiniDay <= thurEnd) {
        if (!isDayOff(currentMiniDay, holidays)) {
          miniBreakDaysNeeded++;
        }
        currentMiniDay.setDate(currentMiniDay.getDate() + 1);
      }
      
      additionalPeriods.push({
        start: thurStart,
        end: thurEnd,
        days: 4,
        vacationDaysNeeded: miniBreakDaysNeeded,
        description: `Långhelg i ${getMonthName(month - 1)}`,
        type: "weekend",
        score: 45
      });
    }
  });
  
  return additionalPeriods;
};

// Helper function to get month name
const getMonthName = (monthIndex: number): string => {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
};
