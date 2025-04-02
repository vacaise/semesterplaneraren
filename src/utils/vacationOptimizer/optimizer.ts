
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
  periods.push(...findBridgeDays(year, holidays));
  
  // 3. Find extended weekends (Thursday-Sunday or Friday-Monday)
  periods.push(...findExtendedWeekends(year, holidays));
  
  // 4. Find summer vacation options
  periods.push(...findSummerPeriods(year, holidays));
  
  // 5. Generate more possible combinations to increase efficiency
  const additionalPeriods = generateAdditionalPeriods(year, holidays);
  periods.push(...additionalPeriods);
  
  return periods;
};

// Generate additional vacation period options to maximize efficiency
const generateAdditionalPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const additionalPeriods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Add week-long options focusing on months with higher holiday density
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  months.forEach(month => {
    // Create a week-long period in the middle of each month
    const startDay = new Date(year, month - 1, 15);
    
    // Skip months that are in the past
    if (startDay < today && startDay.getFullYear() === today.getFullYear()) {
      return;
    }
    
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
    
    // Calculate efficiency score: total days / vacation days needed
    const efficiencyScore = 7 / Math.max(vacationDaysNeeded, 1);
    const baseScore = 50;
    
    // Increase score for periods with good efficiency
    const efficiencyBonus = Math.floor((efficiencyScore - 1) * 20);
    
    additionalPeriods.push({
      start: new Date(startDay),
      end: new Date(endDay),
      days: 7,
      vacationDaysNeeded,
      description: `${month}-veckan`,
      type: "week",
      score: baseScore + efficiencyBonus
    });
    
    // Also add mini-breaks (Thursday-Sunday)
    const thursdayDate = new Date(year, month - 1, 1);
    // Find the first Thursday of the month
    while (thursdayDate.getDay() !== 4) {
      thursdayDate.setDate(thursdayDate.getDate() + 1);
    }
    
    // Add 3 Thursday-Sunday mini-breaks per month for better coverage
    for (let i = 0; i < 3; i++) {
      const thurStart = new Date(thursdayDate);
      thurStart.setDate(thursdayDate.getDate() + (i * 7)); // Every Thursday
      
      // Skip if in the past
      if (thurStart < today && thurStart.getFullYear() === today.getFullYear()) {
        continue;
      }
      
      const thurEnd = new Date(thurStart);
      thurEnd.setDate(thurStart.getDate() + 3); // Sunday
      
      // Calculate vacation days needed
      let miniBreakDaysNeeded = 0;
      const currentMiniDay = new Date(thurStart);
      
      while (currentMiniDay <= thurEnd) {
        if (!isDayOff(currentMiniDay, holidays)) {
          miniBreakDaysNeeded++;
        }
        currentMiniDay.setDate(currentMiniDay.getDate() + 1);
      }
      
      // Calculate efficiency for this mini-break
      const miniBreakEfficiency = 4 / Math.max(miniBreakDaysNeeded, 1);
      const miniBreakBonus = Math.floor((miniBreakEfficiency - 1) * 15);
      
      additionalPeriods.push({
        start: thurStart,
        end: thurEnd,
        days: 4,
        vacationDaysNeeded: miniBreakDaysNeeded,
        description: `Långhelg i ${getMonthName(month - 1)}`,
        type: "weekend",
        score: 45 + miniBreakBonus
      });
    }
    
    // Add Monday-Wednesday mini-breaks for more options
    const mondayDate = new Date(year, month - 1, 1);
    // Find the first Monday of the month
    while (mondayDate.getDay() !== 1) {
      mondayDate.setDate(mondayDate.getDate() + 1);
    }
    
    // Add Monday-Wednesday mini-breaks
    for (let i = 0; i < 2; i++) {
      const monStart = new Date(mondayDate);
      monStart.setDate(mondayDate.getDate() + (i * 14)); // Every other Monday
      
      // Skip if in the past
      if (monStart < today && monStart.getFullYear() === today.getFullYear()) {
        continue;
      }
      
      const monEnd = new Date(monStart);
      monEnd.setDate(monStart.getDate() + 2); // Wednesday
      
      // Calculate vacation days needed
      let monWedDaysNeeded = 0;
      const currentMonDay = new Date(monStart);
      
      while (currentMonDay <= monEnd) {
        if (!isDayOff(currentMonDay, holidays)) {
          monWedDaysNeeded++;
        }
        currentMonDay.setDate(currentMonDay.getDate() + 1);
      }
      
      additionalPeriods.push({
        start: monStart,
        end: monEnd,
        days: 3,
        vacationDaysNeeded: monWedDaysNeeded,
        description: `Minisemester i ${getMonthName(month - 1)}`,
        type: "mini",
        score: 40
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
