
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
  mode: string,
  useExactDays = false
): VacationPeriod[] => {
  // Generate all possible periods by scanning the year
  const allPossiblePeriods = generatePossiblePeriods(year, holidays);
  
  // Score and prioritize periods based on the selected mode
  const scoredPeriods = scorePeriods(allPossiblePeriods, mode);
  
  // Generate additional periods to fill in gaps and maximize total time off
  const extraPeriods = createExtraPeriods(year, holidays);
  const allPeriods = [...scoredPeriods, ...extraPeriods];
  
  // Select the optimal combination of periods, ensuring exact vacation day usage if requested
  return selectOptimalPeriods(allPeriods, vacationDays, year, holidays, mode, useExactDays);
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
