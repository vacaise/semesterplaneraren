import { addDays, differenceInDays, format, isSameDay } from 'date-fns';
import { VacationPeriod, OptimizationMode } from './types';
import { isDayOff } from './helpers';
import { selectOptimalPeriods } from './periodSelector';
import { findKeyPeriods, findBridgeDays, findExtendedWeekends, findSummerPeriods, createExtraPeriods } from './periodFinders';
import { scorePeriods } from './scoringSystem';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDaysTarget: number,
  holidays: Date[],
  mode: string
): VacationPeriod[] => {
  console.log(`Starting optimization for ${year} with ${vacationDaysTarget} days in ${mode} mode`);
  
  // Generate all possible periods by scanning the year
  const allPossiblePeriods = generatePossiblePeriods(year, holidays);
  console.log(`Generated ${allPossiblePeriods.length} possible periods`);
  
  // Score and prioritize periods based on the selected mode
  const scoredPeriods = scorePeriods(allPossiblePeriods, mode, vacationDaysTarget);
  
  // Generate additional periods to fill in gaps and maximize total time off
  const extraPeriods = createExtraPeriods(year, holidays);
  const scoredExtraPeriods = scorePeriods(extraPeriods, mode, vacationDaysTarget);
  
  // Generate strategic periods around holidays to maximize efficiency
  const strategicPeriods = generateStrategicPeriods(year, holidays);
  const scoredStrategicPeriods = scorePeriods(strategicPeriods, mode, vacationDaysTarget);
  
  const allPeriods = [...scoredPeriods, ...scoredExtraPeriods, ...scoredStrategicPeriods];
  console.log(`Total periods to consider: ${allPeriods.length}`);
  
  // Select the optimal combination of periods with strict vacation day requirements
  const selectedPeriods = selectOptimalPeriods(allPeriods, vacationDaysTarget, year, holidays, mode);
  console.log(`Selected ${selectedPeriods.length} periods totaling ${selectedPeriods.reduce((sum, p) => sum + p.vacationDaysNeeded, 0)} vacation days`);
  
  // CRITICAL VALIDATION: The exact number of days must be used
  const daysUsed = selectedPeriods.reduce((sum, period) => sum + period.vacationDaysNeeded, 0);
  if (daysUsed !== vacationDaysTarget) {
    throw new Error(`Failed to use exactly ${vacationDaysTarget} vacation days. This is a critical error in the optimization algorithm.`);
  }
  
  return selectedPeriods;
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
  
  // 6. Generate more distributed small periods throughout the year
  const distributedPeriods = generateDistributedPeriods(year, holidays);
  periods.push(...distributedPeriods);
  
  return periods;
};

// Generate strategic periods that maximize efficiency by targeting holiday clusters
const generateStrategicPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const strategicPeriods: VacationPeriod[] = [];
  
  // Create a map of month -> days with holidays
  const holidayMap = new Map<number, number[]>();
  
  // Group holidays by month
  holidays.forEach(holiday => {
    const month = holiday.getMonth();
    const day = holiday.getDate();
    
    if (!holidayMap.has(month)) {
      holidayMap.set(month, []);
    }
    
    holidayMap.get(month)?.push(day);
  });
  
  // For each month with holidays, find strategic periods
  holidayMap.forEach((days, month) => {
    // Sort days in ascending order
    days.sort((a, b) => a - b);
    
    // If there are multiple holidays in a month, look for strategic periods
    if (days.length > 1) {
      for (let i = 0; i < days.length - 1; i++) {
        const firstHoliday = days[i];
        
        // Look for holidays that are relatively close to each other
        for (let j = i + 1; j < days.length; j++) {
          const secondHoliday = days[j];
          
          // If holidays are within 10 days, consider creating a strategic period
          if (secondHoliday - firstHoliday < 10) {
            const startDate = new Date(year, month, firstHoliday - 1);
            const endDate = new Date(year, month, secondHoliday + 1);
            
            // Adjust start and end to include weekends if close
            while (startDate.getDay() > 1 && startDate.getDay() < 6) {
              startDate.setDate(startDate.getDate() - 1);
            }
            
            while (endDate.getDay() > 0 && endDate.getDay() < 5) {
              endDate.setDate(endDate.getDate() + 1);
            }
            
            // Calculate vacation days needed
            let vacationDaysNeeded = 0;
            const currentDay = new Date(startDate);
            
            while (currentDay <= endDate) {
              if (!isDayOff(currentDay, holidays)) {
                vacationDaysNeeded++;
              }
              currentDay.setDate(currentDay.getDate() + 1);
            }
            
            // Only add if it requires vacation days and isn't too long
            if (vacationDaysNeeded > 0 && vacationDaysNeeded <= 7) {
              strategicPeriods.push({
                start: new Date(startDate),
                end: new Date(endDate),
                days: differenceInDays(endDate, startDate) + 1,
                vacationDaysNeeded,
                description: `Strategisk period ${getMonthName(month)}`,
                type: "strategic",
                score: 90 // High score for strategic periods
              });
            }
          }
        }
      }
    }
    
    // For single holidays, extend in both directions to maximize time off
    days.forEach(day => {
      const holidayDate = new Date(year, month, day);
      const dayOfWeek = holidayDate.getDay();
      
      // Extend before
      if (dayOfWeek !== 1 && dayOfWeek !== 0) { // Not Monday or Sunday
        const beforeStart = new Date(holidayDate);
        beforeStart.setDate(beforeStart.getDate() - (dayOfWeek === 2 ? 3 : dayOfWeek === 3 ? 2 : 1));
        
        let vacationDaysNeeded = 0;
        const currentDay = new Date(beforeStart);
        
        while (currentDay < holidayDate) {
          if (!isDayOff(currentDay, holidays)) {
            vacationDaysNeeded++;
          }
          currentDay.setDate(currentDay.getDate() + 1);
        }
        
        if (vacationDaysNeeded > 0 && vacationDaysNeeded <= 3) {
          strategicPeriods.push({
            start: new Date(beforeStart),
            end: new Date(holidayDate),
            days: differenceInDays(holidayDate, beforeStart) + 1,
            vacationDaysNeeded,
            description: `Förlängd ledighet ${getMonthName(month)}`,
            type: "extension",
            score: 75
          });
        }
      }
      
      // Extend after
      if (dayOfWeek !== 5 && dayOfWeek !== 6) { // Not Friday or Saturday
        const afterEnd = new Date(holidayDate);
        afterEnd.setDate(afterEnd.getDate() + (dayOfWeek === 4 ? 3 : dayOfWeek === 3 ? 2 : 1));
        
        let vacationDaysNeeded = 0;
        const currentDay = new Date(holidayDate);
        currentDay.setDate(currentDay.getDate() + 1);
        
        while (currentDay <= afterEnd) {
          if (!isDayOff(currentDay, holidays)) {
            vacationDaysNeeded++;
          }
          currentDay.setDate(currentDay.getDate() + 1);
        }
        
        if (vacationDaysNeeded > 0 && vacationDaysNeeded <= 3) {
          strategicPeriods.push({
            start: new Date(holidayDate),
            end: new Date(afterEnd),
            days: differenceInDays(afterEnd, holidayDate) + 1,
            vacationDaysNeeded,
            description: `Förlängd ledighet ${getMonthName(month)}`,
            type: "extension",
            score: 75
          });
        }
      }
      
      // Both before and after for maximum efficiency
      if (dayOfWeek !== 1 && dayOfWeek !== 5 && dayOfWeek !== 0 && dayOfWeek !== 6) {
        const fullStart = new Date(holidayDate);
        fullStart.setDate(fullStart.getDate() - (dayOfWeek === 2 ? 3 : dayOfWeek === 3 ? 2 : 1));
        
        const fullEnd = new Date(holidayDate);
        fullEnd.setDate(fullEnd.getDate() + (dayOfWeek === 4 ? 3 : dayOfWeek === 3 ? 2 : 1));
        
        let vacationDaysNeeded = 0;
        const currentDay = new Date(fullStart);
        
        while (currentDay <= fullEnd) {
          if (!isDayOff(currentDay, holidays)) {
            vacationDaysNeeded++;
          }
          currentDay.setDate(currentDay.getDate() + 1);
        }
        
        if (vacationDaysNeeded > 0 && vacationDaysNeeded <= 5) {
          strategicPeriods.push({
            start: new Date(fullStart),
            end: new Date(fullEnd),
            days: differenceInDays(fullEnd, fullStart) + 1,
            vacationDaysNeeded,
            description: `Maximal ledighet ${getMonthName(month)}`,
            type: "extension",
            score: 85
          });
        }
      }
    });
  });
  
  return strategicPeriods;
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
      score: 60
    });
    
    // Also add mini-breaks (Thursday-Sunday) throughout the month
    for (let weekNumber = 1; weekNumber <= 4; weekNumber++) {
      const thursdayDate = new Date(year, month - 1, weekNumber * 7);
      // Find Thursday
      while (thursdayDate.getDay() !== 4) {
        thursdayDate.setDate(thursdayDate.getDate() + 1);
      }
      
      // Check that the date is still in the right month
      if (thursdayDate.getMonth() !== month - 1) continue;
      
      const thurStart = new Date(thursdayDate);
      const thurEnd = new Date(thursdayDate);
      thurEnd.setDate(thursdayDate.getDate() + 3); // Sunday
      
      // Calculate vacation days needed
      let miniBreakDaysNeeded = 0;
      const currentMiniDay = new Date(thurStart);
      
      while (currentMiniDay <= thurEnd) {
        if (!isDayOff(currentMiniDay, holidays)) {
          miniBreakDaysNeeded++;
        }
        currentMiniDay.setDate(currentMiniDay.getDate() + 1);
      }
      
      if (miniBreakDaysNeeded > 0) {
        additionalPeriods.push({
          start: thurStart,
          end: thurEnd,
          days: 4,
          vacationDaysNeeded: miniBreakDaysNeeded,
          description: `Långhelg i ${getMonthName(month - 1)}`,
          type: "weekend",
          score: 55 + (miniBreakDaysNeeded === 1 ? 20 : 0) // Boost if only 1 vacation day needed
        });
      }
      
      // Also add Friday-Monday options
      const fridayDate = new Date(year, month - 1, weekNumber * 7 + 1);
      while (fridayDate.getDay() !== 5) {
        fridayDate.setDate(fridayDate.getDate() + 1);
      }
      
      // Check that the date is still in the right month
      if (fridayDate.getMonth() !== month - 1) continue;
      
      const friStart = new Date(fridayDate);
      const friEnd = new Date(fridayDate);
      friEnd.setDate(fridayDate.getDate() + 3); // Monday
      
      // Calculate vacation days needed
      let friBrDaysNeeded = 0;
      const currentFriDay = new Date(friStart);
      
      while (currentFriDay <= friEnd) {
        if (!isDayOff(currentFriDay, holidays)) {
          friBrDaysNeeded++;
        }
        currentFriDay.setDate(currentFriDay.getDate() + 1);
      }
      
      if (friBrDaysNeeded > 0) {
        additionalPeriods.push({
          start: friStart,
          end: friEnd,
          days: 4,
          vacationDaysNeeded: friBrDaysNeeded,
          description: `Långhelg i ${getMonthName(month - 1)}`,
          type: "weekend",
          score: 55 + (friBrDaysNeeded === 1 ? 20 : 0) // Boost if only 1 vacation day needed
        });
      }
    }
  });
  
  return additionalPeriods;
};

// Generate more distributed small periods to ensure better coverage throughout the year
const generateDistributedPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const distributedPeriods: VacationPeriod[] = [];
  
  // Add more strategic short periods throughout the year
  // Focus on different months to ensure good distribution
  for (let month = 0; month < 12; month++) {
    // For each month, add some 2-4 day mini-breaks
    for (let startDay = 5; startDay < 25; startDay += 7) {
      const startDate = new Date(year, month, startDay);
      
      // Skip weekends as starting days
      if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        continue;
      }
      
      // Create mini-breaks of various lengths
      const endDate = new Date(startDate);
      
      // Adjust endDate based on startDate's day of week
      switch (startDate.getDay()) {
        case 1: // Monday - extend until Thursday
          endDate.setDate(startDate.getDate() + 3);
          break;
        case 2: // Tuesday - extend through weekend
          endDate.setDate(startDate.getDate() + 5);
          break;
        case 3: // Wednesday - extend until Friday
          endDate.setDate(startDate.getDate() + 2);
          break;
        case 4: // Thursday - extend through weekend
          endDate.setDate(startDate.getDate() + 3);
          break;
        case 5: // Friday - extend until Monday
          endDate.setDate(startDate.getDate() + 3);
          break;
      }
      
      // Calculate vacation days needed
      let miniBreakDaysNeeded = 0;
      const currentDay = new Date(startDate);
      
      while (currentDay <= endDate) {
        if (!isDayOff(currentDay, holidays)) {
          miniBreakDaysNeeded++;
        }
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      // Only add if the period requires vacation days and is efficient
      if (miniBreakDaysNeeded > 0) {
        const totalDays = differenceInDays(endDate, startDate) + 1;
        const efficiency = totalDays / miniBreakDaysNeeded;
        
        // Add higher scores for more efficient periods
        let score = 40 + Math.min(efficiency * 10, 30);
        
        // Boost summer months
        if (month >= 5 && month <= 8) {
          score += 15;
        }
        
        distributedPeriods.push({
          start: new Date(startDate),
          end: new Date(endDate),
          days: totalDays,
          vacationDaysNeeded: miniBreakDaysNeeded,
          description: `${totalDays}-dagars ledighet i ${getMonthName(month)}`,
          type: "mini",
          score
        });
      }
    }
  }
  
  return distributedPeriods;
};

// Helper function to get month name
const getMonthName = (monthIndex: number): string => {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
};
