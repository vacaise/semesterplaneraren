
import { addDays, differenceInDays, format, isSameDay } from 'date-fns';
import { VacationPeriod, OptimizationMode } from './types';
import { isDayOff } from './helpers';

// Main function to find and optimize vacation periods
export const findOptimalSchedule = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): VacationPeriod[] => {
  // Generate all possible periods by scanning the year
  const allPossiblePeriods = generatePossiblePeriods(year, holidays);
  
  // Score each period based on efficiency and preferences
  const scoredPeriods = scorePeriods(allPossiblePeriods, mode, holidays);
  
  // Select the optimal combination of periods
  return selectOptimalCombination(scoredPeriods, vacationDays, holidays);
};

// Generate all possible vacation periods around holidays and weekends
const generatePossiblePeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Define the start and end of the year
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  // 1. Find extended weekends (Thursday-Sunday or Friday-Monday)
  periods.push(...findExtendedWeekends(year, holidays));
  
  // 2. Find bridge days between holidays and weekends
  periods.push(...findBridgeDays(year, holidays));
  
  // 3. Find periods around major holidays
  periods.push(...findHolidayPeriods(year, holidays));
  
  // 4. Find summer vacation options
  periods.push(...findSummerPeriods(year));
  
  // 5. Add some standard week-long breaks throughout the year
  periods.push(...findStandardBreaks(year));
  
  return periods;
};

// Find 3-4 day weekends by taking Friday or Monday off
const findExtendedWeekends = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Loop through all months except those with major holidays
  for (let month = 0; month < 12; month++) {
    // Skip months that typically have major holidays to avoid overlap
    if ([0, 3, 5, 11].includes(month)) continue;
    
    for (let day = 1; day <= 28; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Friday (5) - extend weekend by taking Monday off
      if (dayOfWeek === 5) {
        const monday = addDays(date, 3);
        
        // Skip if Monday is already a holiday
        if (isHoliday(monday, holidays)) continue;
        
        periods.push({
          start: date,
          end: addDays(date, 3),
          days: 4,
          vacationDaysNeeded: 1,
          description: `Långhelg i ${getMonthName(month)}`,
          type: "weekend",
          score: 65
        });
      }
      
      // Monday (1) - extend weekend by taking Friday off
      if (dayOfWeek === 1) {
        const friday = addDays(date, -3);
        
        // Skip if Friday is already a holiday
        if (isHoliday(friday, holidays)) continue;
        
        periods.push({
          start: friday,
          end: date,
          days: 4,
          vacationDaysNeeded: 1,
          description: `Långhelg i ${getMonthName(month)}`,
          type: "weekend",
          score: 65
        });
      }
    }
  }
  
  return periods;
};

// Find days that bridge between holidays and weekends
const findBridgeDays = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Check each holiday
  holidays.forEach(holiday => {
    const dayOfWeek = holiday.getDay();
    
    // Tuesday holiday - take Monday off
    if (dayOfWeek === 2) {
      const monday = addDays(holiday, -1);
      
      periods.push({
        start: addDays(holiday, -3), // Saturday
        end: holiday,
        days: 4,
        vacationDaysNeeded: 1,
        description: `Brygga till ${formatHolidayName(holiday, year)}`,
        type: "bridge",
        score: 80
      });
    }
    
    // Thursday holiday - take Friday off
    if (dayOfWeek === 4) {
      const friday = addDays(holiday, 1);
      
      periods.push({
        start: holiday,
        end: addDays(holiday, 3), // Sunday
        days: 4,
        vacationDaysNeeded: 1,
        description: `Brygga från ${formatHolidayName(holiday, year)}`,
        type: "bridge",
        score: 80
      });
    }
    
    // Wednesday holiday - take Monday, Tuesday, Thursday, Friday off for a 9-day vacation
    if (dayOfWeek === 3) {
      periods.push({
        start: addDays(holiday, -4), // Saturday before
        end: addDays(holiday, 4),    // Sunday after
        days: 9,
        vacationDaysNeeded: 4,
        description: `Lång ledighet kring ${formatHolidayName(holiday, year)}`,
        type: "midweek",
        score: 75
      });
    }
  });
  
  return periods;
};

// Find periods around major holidays like Christmas, Easter, Midsummer
const findHolidayPeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Easter period (usually in April)
  const easterDates = holidays.filter(date => {
    // Find Easter Sunday and surrounding dates
    const month = date.getMonth();
    return (month === 2 || month === 3) && isNearEaster(date, holidays);
  });
  
  if (easterDates.length > 0) {
    // Sort to find the earliest date
    easterDates.sort((a, b) => a.getTime() - b.getTime());
    const easterStart = addDays(easterDates[0], -3); // Include weekend before
    const easterEnd = addDays(easterDates[easterDates.length - 1], 3); // Include weekend after
    
    periods.push({
      start: easterStart,
      end: easterEnd,
      days: differenceInDays(easterEnd, easterStart) + 1,
      vacationDaysNeeded: calculateWorkdaysInPeriod(easterStart, easterEnd, holidays),
      description: "Påskledighet",
      type: "holiday",
      score: 90
    });
  }
  
  // Christmas/New Year period (December-January)
  const christmasStart = new Date(year, 11, 20);
  const newYearEnd = new Date(year + 1, 0, 7);
  
  periods.push({
    start: christmasStart,
    end: newYearEnd,
    days: differenceInDays(newYearEnd, christmasStart) + 1,
    vacationDaysNeeded: calculateWorkdaysInPeriod(christmasStart, newYearEnd, holidays),
    description: "Jul och nyår",
    type: "holiday",
    score: 95
  });
  
  // Midsummer (late June)
  const midsummerDates = holidays.filter(date => {
    const month = date.getMonth();
    const day = date.getDate();
    return month === 5 && day >= 19 && day <= 26; // Around June 20-25
  });
  
  if (midsummerDates.length > 0) {
    midsummerDates.sort((a, b) => a.getTime() - b.getTime());
    const midsummerStart = addDays(midsummerDates[0], -3);
    const midsummerEnd = addDays(midsummerDates[midsummerDates.length - 1], 3);
    
    periods.push({
      start: midsummerStart,
      end: midsummerEnd,
      days: differenceInDays(midsummerEnd, midsummerStart) + 1,
      vacationDaysNeeded: calculateWorkdaysInPeriod(midsummerStart, midsummerEnd, holidays),
      description: "Midsommarledighet",
      type: "holiday",
      score: 85
    });
  }
  
  return periods;
};

// Find summer vacation periods
const findSummerPeriods = (year: number): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Early July (3 weeks)
  const julyStart = new Date(year, 6, 1);
  const julyEnd = new Date(year, 6, 21);
  
  periods.push({
    start: julyStart,
    end: julyEnd,
    days: differenceInDays(julyEnd, julyStart) + 1,
    vacationDaysNeeded: 15, // Approximately 3 work weeks
    description: "Sommarsemester (juli)",
    type: "summer",
    score: 70
  });
  
  // Late July - Early August (2 weeks)
  const lateJulyStart = new Date(year, 6, 22);
  const earlyAugustEnd = new Date(year, 7, 5);
  
  periods.push({
    start: lateJulyStart,
    end: earlyAugustEnd,
    days: differenceInDays(earlyAugustEnd, lateJulyStart) + 1,
    vacationDaysNeeded: 10, // Approximately 2 work weeks
    description: "Sommarsemester (juli-augusti)",
    type: "summer",
    score: 70
  });
  
  // Mid-August (1 week)
  const midAugustStart = new Date(year, 7, 6);
  const midAugustEnd = new Date(year, 7, 13);
  
  periods.push({
    start: midAugustStart,
    end: midAugustEnd,
    days: differenceInDays(midAugustEnd, midAugustStart) + 1,
    vacationDaysNeeded: 5, // Approximately 1 work week
    description: "Sommarsemester (augusti)",
    type: "summer",
    score: 65
  });
  
  return periods;
};

// Find standard week-long breaks throughout the year
const findStandardBreaks = (year: number): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // February break (winter sports)
  const febStart = new Date(year, 1, 15);
  const febEnd = new Date(year, 1, 21);
  
  periods.push({
    start: febStart,
    end: febEnd,
    days: differenceInDays(febEnd, febStart) + 1,
    vacationDaysNeeded: 5,
    description: "Sportlov",
    type: "seasonal",
    score: 60
  });
  
  // May break (spring)
  const mayStart = new Date(year, 4, 10);
  const mayEnd = new Date(year, 4, 16);
  
  periods.push({
    start: mayStart,
    end: mayEnd,
    days: differenceInDays(mayEnd, mayStart) + 1,
    vacationDaysNeeded: 5,
    description: "Vårsemester",
    type: "seasonal",
    score: 60
  });
  
  // October break (autumn)
  const octStart = new Date(year, 9, 15);
  const octEnd = new Date(year, 9, 21);
  
  periods.push({
    start: octStart,
    end: octEnd,
    days: differenceInDays(octEnd, octStart) + 1,
    vacationDaysNeeded: 5,
    description: "Höstlov",
    type: "seasonal",
    score: 60
  });
  
  return periods;
};

// Score periods based on optimization mode
const scorePeriods = (
  periods: VacationPeriod[],
  mode: string,
  holidays: Date[]
): VacationPeriod[] => {
  return periods.map(period => {
    const efficiency = period.days / period.vacationDaysNeeded;
    let modeScore = 0;
    
    // Apply mode-specific scoring
    switch (mode) {
      case "longweekends":
        modeScore = period.days <= 4 ? 50 : 0;
        break;
      case "minibreaks":
        modeScore = period.days > 4 && period.days <= 6 ? 50 : 0;
        break;
      case "weeks":
        modeScore = period.days > 6 && period.days <= 9 ? 50 : 0;
        break;
      case "extended":
        modeScore = period.days > 9 ? 50 : 0;
        break;
      case "balanced":
      default:
        // More balanced scoring across all period lengths
        modeScore = 25;
    }
    
    // Calculate final score based on efficiency and mode preference
    const finalScore = (period.score || 0) + (efficiency * 10) + modeScore;
    
    return {
      ...period,
      score: finalScore
    };
  }).sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by score (highest first)
};

// Select the optimal combination of periods
const selectOptimalCombination = (
  scoredPeriods: VacationPeriod[],
  availableVacationDays: number,
  holidays: Date[]
): VacationPeriod[] => {
  const selectedPeriods: VacationPeriod[] = [];
  let remainingDays = availableVacationDays;
  
  // Filter out periods that are in the past
  const futurePeriods = scoredPeriods.filter(period => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return period.end >= today;
  });
  
  // First try to add highest-scored periods without overlaps
  const usedDates = new Set<string>();
  
  for (const period of futurePeriods) {
    if (period.vacationDaysNeeded <= remainingDays) {
      // Check for date overlaps with already selected periods
      let hasOverlap = false;
      let currentDate = new Date(period.start);
      
      while (currentDate <= period.end) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        if (usedDates.has(dateStr)) {
          hasOverlap = true;
          break;
        }
        currentDate = addDays(currentDate, 1);
      }
      
      if (!hasOverlap) {
        // Add this period
        selectedPeriods.push(period);
        remainingDays -= period.vacationDaysNeeded;
        
        // Mark all dates in this period as used
        currentDate = new Date(period.start);
        while (currentDate <= period.end) {
          usedDates.add(format(currentDate, 'yyyy-MM-dd'));
          currentDate = addDays(currentDate, 1);
        }
      }
    }
    
    // Break if all vacation days are allocated
    if (remainingDays <= 0) break;
  }
  
  // If we still have days left, try to add smaller periods
  if (remainingDays > 0) {
    for (const period of futurePeriods) {
      if (selectedPeriods.includes(period)) continue;
      
      if (period.vacationDaysNeeded <= remainingDays) {
        // Check for date overlaps with already selected periods
        let hasOverlap = false;
        let currentDate = new Date(period.start);
        
        while (currentDate <= period.end) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          if (usedDates.has(dateStr)) {
            hasOverlap = true;
            break;
          }
          currentDate = addDays(currentDate, 1);
        }
        
        if (!hasOverlap) {
          // Add this period
          selectedPeriods.push(period);
          remainingDays -= period.vacationDaysNeeded;
          
          // Mark all dates in this period as used
          currentDate = new Date(period.start);
          while (currentDate <= period.end) {
            usedDates.add(format(currentDate, 'yyyy-MM-dd'));
            currentDate = addDays(currentDate, 1);
          }
        }
      }
      
      // Break if all vacation days are allocated
      if (remainingDays <= 0) break;
    }
  }
  
  // Sort the final selected periods by date
  return selectedPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());
};

// Helper function to check if a day is a holiday
function isHoliday(date: Date, holidays: Date[]): boolean {
  return holidays.some(holiday => isSameDay(date, holiday));
}

// Helper function to format holiday name based on date
function formatHolidayName(holiday: Date, year: number): string {
  const month = holiday.getMonth();
  const day = holiday.getDate();
  
  // Common Swedish holidays
  if (month === 0 && day === 1) return "Nyårsdagen";
  if (month === 0 && day === 6) return "Trettondedag jul";
  if (month === 4 && day === 1) return "Första maj";
  if (month === 5 && day === 6) return "Sveriges nationaldag";
  if (month === 11 && day === 24) return "Julafton";
  if (month === 11 && day === 25) return "Juldagen";
  if (month === 11 && day === 26) return "Annandag jul";
  if (month === 11 && day === 31) return "Nyårsafton";
  
  // Generic name based on month
  return `helgdag i ${getMonthName(month)}`;
}

// Helper function to check if a date is near Easter
function isNearEaster(date: Date, holidays: Date[]): boolean {
  // Simple check - if it's in March/April and is a holiday, it's likely Easter-related
  return (date.getMonth() === 2 || date.getMonth() === 3) && 
         (date.getDay() === 5 || date.getDay() === 0 || date.getDay() === 1); // Friday, Sunday, Monday
}

// Helper function to calculate workdays in a period
function calculateWorkdaysInPeriod(start: Date, end: Date, holidays: Date[]): number {
  let workdays = 0;
  let current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Skip weekends and holidays
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(current, holidays)) {
      workdays++;
    }
    current = addDays(current, 1);
  }
  
  return workdays;
}

// Helper function to get month name in Swedish
function getMonthName(monthIndex: number): string {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
}
