
import { addDays, format, isSameDay, differenceInDays } from 'date-fns';
import { VacationPeriod, OptimizationMode } from './types';
import { isDayOff } from './helpers';
import { selectOptimalPeriods } from './periodSelector';
import { calculateVacationDaysNeeded } from './calculators';

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

// Generate periods around major holidays
function generateHolidayPeriods(year: number, holidays: Date[]): VacationPeriod[] {
  const periods: VacationPeriod[] = [];
  const now = new Date();
  
  // For each holiday, create potential vacation periods around it
  holidays.forEach(holiday => {
    // Skip holidays in the past
    if (holiday < now) return;
    
    const holidayMonth = holiday.getMonth();
    const holidayName = getHolidayName(holiday, year);
    
    // Create various period lengths around this holiday
    [2, 3, 4, 5, 7, 9, 14].forEach(periodLength => {
      // Create period before the holiday
      const beforeStart = new Date(holiday);
      beforeStart.setDate(holiday.getDate() - (periodLength - 1));
      
      // Skip if start is in the past
      if (beforeStart >= now) {
        const beforePeriod = createPeriod(
          beforeStart, 
          holiday, 
          holidays,
          `${holidayName} ledighet`,
          "holiday"
        );
        periods.push(beforePeriod);
      }
      
      // Create period after the holiday
      const afterEnd = new Date(holiday);
      afterEnd.setDate(holiday.getDate() + (periodLength - 1));
      
      const afterPeriod = createPeriod(
        holiday, 
        afterEnd, 
        holidays,
        `${holidayName} ledighet`,
        "holiday"
      );
      periods.push(afterPeriod);
      
      // Create period centered on the holiday
      const centeredStart = new Date(holiday);
      centeredStart.setDate(holiday.getDate() - Math.floor(periodLength / 2));
      
      const centeredEnd = new Date(holiday);
      centeredEnd.setDate(holiday.getDate() + Math.floor(periodLength / 2));
      
      // Skip if start is in the past
      if (centeredStart >= now) {
        const centeredPeriod = createPeriod(
          centeredStart, 
          centeredEnd, 
          holidays,
          `${holidayName} ledighet`,
          "holiday"
        );
        periods.push(centeredPeriod);
      }
    });
  });
  
  return periods;
}

// Generate bridge day periods (filling gaps between holidays/weekends)
function generateBridgeDayPeriods(year: number, holidays: Date[]): VacationPeriod[] {
  const periods: VacationPeriod[] = [];
  const now = new Date();
  
  // Find potential bridge days (days between holidays/weekends)
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const currentDate = new Date(year, month, day);
      
      // Skip dates in the past
      if (currentDate < now) continue;
      
      // Check if this is a work day
      if (!isDayOff(currentDate, holidays)) {
        // Check if both the previous and next day are days off
        const prevDay = new Date(currentDate);
        prevDay.setDate(currentDate.getDate() - 1);
        
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        
        const isPrevDayOff = isDayOff(prevDay, holidays);
        const isNextDayOff = isDayOff(nextDay, holidays);
        
        // If it's surrounded by days off, it's a bridge day
        if (isPrevDayOff && isNextDayOff) {
          // Create a period for this bridge day
          const period = createPeriod(
            currentDate,
            currentDate,
            holidays,
            `Klämdag ${getMonthName(month)}`,
            "bridge"
          );
          
          // Give bridge days a high score (very efficient)
          period.score = 80;
          periods.push(period);
          
          // Also create extended periods around this bridge day
          const extendedStart = new Date(prevDay);
          extendedStart.setDate(prevDay.getDate() - 2); // Include more days
          
          const extendedEnd = new Date(nextDay);
          extendedEnd.setDate(nextDay.getDate() + 2);
          
          if (extendedStart >= now) {
            const extendedPeriod = createPeriod(
              extendedStart,
              extendedEnd,
              holidays,
              `Förlängd klämdag ${getMonthName(month)}`,
              "bridge"
            );
            extendedPeriod.score = 75;
            periods.push(extendedPeriod);
          }
        }
      }
    }
  }
  
  return periods;
}

// Generate extended weekend periods
function generateExtendedWeekendPeriods(year: number, holidays: Date[]): VacationPeriod[] {
  const periods: VacationPeriod[] = [];
  const now = new Date();
  
  // For each month, create extended weekend options
  for (let month = 0; month < 12; month++) {
    for (let week = 1; week <= 4; week++) {
      // Try creating a Thursday-Monday extended weekend
      const thursday = findDayInMonth(year, month, week, 4); // Thursday is 4
      
      if (thursday < now) continue;
      
      const monday = new Date(thursday);
      monday.setDate(thursday.getDate() + 4); // Monday after this Thursday
      
      const thursdayToMonday = createPeriod(
        thursday,
        monday,
        holidays,
        `Långhelg i ${getMonthName(month)}`,
        "weekend"
      );
      periods.push(thursdayToMonday);
      
      // Also create Friday-Monday (3-day weekend)
      const friday = new Date(thursday);
      friday.setDate(thursday.getDate() + 1);
      
      if (friday >= now) {
        const fridayToMonday = createPeriod(
          friday,
          monday,
          holidays,
          `Helgledighet ${getMonthName(month)}`,
          "weekend"
        );
        periods.push(fridayToMonday);
      }
    }
  }
  
  return periods;
}

// Generate summer vacation periods
function generateSummerPeriods(year: number, holidays: Date[]): VacationPeriod[] {
  const periods: VacationPeriod[] = [];
  const now = new Date();
  
  // Define summer months (June - August)
  const summerMonths = [5, 6, 7]; // 0-indexed months
  
  // Generate different length vacation periods during summer
  summerMonths.forEach(month => {
    // Skip if current month is already past
    const monthDate = new Date(year, month, 15);
    if (monthDate < now && monthDate.getFullYear() === now.getFullYear()) return;
    
    // Create weekly periods throughout the month
    for (let startDay = 1; startDay <= 22; startDay += 7) {
      [7, 14, 21].forEach(periodLength => {
        const startDate = new Date(year, month, startDay);
        
        // Skip if start date is in the past
        if (startDate < now) return;
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + periodLength - 1);
        
        // Create the summer period
        const summerPeriod = createPeriod(
          startDate,
          endDate,
          holidays,
          `${periodLength} dagars ${getMonthName(month)}-semester`,
          "summer"
        );
        
        // Give summer periods a higher score
        summerPeriod.score = 70 + periodLength / 3;
        periods.push(summerPeriod);
      });
    }
  });
  
  return periods;
}

// Generate weekly periods for each month
function generateMonthlyWeeklyPeriods(year: number, holidays: Date[]): VacationPeriod[] {
  const periods: VacationPeriod[] = [];
  const now = new Date();
  
  // For each month, create different weekly options
  for (let month = 0; month < 12; month++) {
    // Find the first Monday of the month
    let firstMonday = findDayInMonth(year, month, 1, 1); // 1 = Monday
    
    // Create different period lengths (1 week, 2 weeks)
    [5, 7, 10, 14].forEach(periodLength => {
      for (let week = 0; week < 4; week++) {
        const startDate = new Date(firstMonday);
        startDate.setDate(firstMonday.getDate() + (week * 7));
        
        // Skip if start date is in the past
        if (startDate < now) continue;
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + periodLength - 1);
        
        // Skip if this period crosses into the next month too much
        if (endDate.getMonth() > month + 1) continue;
        
        const period = createPeriod(
          startDate,
          endDate,
          holidays,
          `${periodLength} dagars ${getMonthName(month)}-ledighet`,
          "week"
        );
        periods.push(period);
      }
    });
  }
  
  return periods;
}

// Generate custom periods for specific vacation day counts
function generateCustomPeriods(year: number, exactVacationDays: number, holidays: Date[]): VacationPeriod[] {
  const customPeriods: VacationPeriod[] = [];
  const now = new Date();
  
  // Try to generate periods with exactly the vacation days needed
  // Prioritize months with good weather (based on northern hemisphere)
  const priorityMonths = [5, 6, 7, 8, 4, 9, 3, 10, 2, 11, 0, 1]; // Jun, Jul, Aug, May, Sep, ...
  
  for (const month of priorityMonths) {
    for (let startDay = 1; startDay <= 21; startDay += 3) {
      // Try starting on different days of the week for variety
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const startDate = new Date(year, month, startDay + dayOffset);
        
        // Skip if in the past
        if (startDate < now) continue;
        
        let currentDay = new Date(startDate);
        let periodVacationDays = 0;
        let totalDays = 0;
        
        // Extend until we reach the exact vacation day count
        while (periodVacationDays < exactVacationDays && totalDays < 50) {
          if (!isDayOff(currentDay, holidays)) {
            periodVacationDays++;
          }
          
          totalDays++;
          currentDay.setDate(currentDay.getDate() + 1);
          
          // If we've reached the exact count, create the period
          if (periodVacationDays === exactVacationDays) {
            const endDate = new Date(currentDay);
            endDate.setDate(currentDay.getDate() - 1); // Back up one day
            
            const period = createPeriod(
              startDate,
              endDate,
              holidays,
              `${exactVacationDays} dagars semester`,
              "custom"
            );
            period.score = 60; // Good score for exact match
            customPeriods.push(period);
            break;
          }
        }
      }
    }
  }
  
  // Create periods that can be combined (half the days, a third of the days, etc.)
  if (exactVacationDays > 5) {
    const divisions = [2, 3, 4].filter(div => exactVacationDays >= div);
    
    for (const divisor of divisions) {
      const partSize = Math.floor(exactVacationDays / divisor);
      
      // Skip trivial cases
      if (partSize < 2) continue;
      
      // Create periods for this part size
      for (const month of priorityMonths) {
        for (let startDay = 1; startDay <= 25; startDay += 5) {
          const startDate = new Date(year, month, startDay);
          
          // Skip if in the past
          if (startDate < now) continue;
          
          let currentDay = new Date(startDate);
          let periodVacationDays = 0;
          let totalDays = 0;
          
          // Extend until we reach the part size
          while (periodVacationDays < partSize && totalDays < 20) {
            if (!isDayOff(currentDay, holidays)) {
              periodVacationDays++;
            }
            
            totalDays++;
            currentDay.setDate(currentDay.getDate() + 1);
          }
          
          // If we reached the part size exactly
          if (periodVacationDays === partSize) {
            const endDate = new Date(currentDay);
            endDate.setDate(currentDay.getDate() - 1); // Back up one day
            
            const period = createPeriod(
              startDate,
              endDate,
              holidays,
              `${partSize} dagars delar`,
              "split"
            );
            period.score = 45;
            customPeriods.push(period);
          }
        }
      }
    }
  }
  
  // If total vacation days is small, also add single day options
  if (exactVacationDays <= 15) {
    customPeriods.push(...generateSingleDayPeriods(year, holidays));
  }
  
  return customPeriods;
}

// Generate single-day vacation periods
function generateSingleDayPeriods(year: number, holidays: Date[]): VacationPeriod[] {
  const singleDayPeriods: VacationPeriod[] = [];
  const now = new Date();
  
  // Create single day options (especially near holidays and on Fridays/Mondays)
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const date = new Date(year, month, day);
      
      // Skip if in the past or a day off
      if (date < now || isDayOff(date, holidays)) continue;
      
      // Check the day of week (prioritize Mondays and Fridays)
      const dayOfWeek = date.getDay();
      const isStrategicDay = dayOfWeek === 1 || dayOfWeek === 5; // Monday or Friday
      
      // Check if it's adjacent to a holiday
      const prevDay = new Date(date);
      prevDay.setDate(date.getDate() - 1);
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const nextToDayOff = isDayOff(prevDay, holidays) || isDayOff(nextDay, holidays);
      
      // Create the period
      const period = createPeriod(
        date,
        date,
        holidays,
        `Ledig ${date.getDate()} ${getMonthName(month)}`,
        "single"
      );
      
      // Score based on strategic placement
      period.score = isStrategicDay ? 50 : 30;
      if (nextToDayOff) period.score += 20;
      
      singleDayPeriods.push(period);
    }
  }
  
  return singleDayPeriods;
}

// Helper: Create a period with calculated vacation days and total days
function createPeriod(
  start: Date, 
  end: Date, 
  holidays: Date[],
  description: string,
  type: string
): VacationPeriod {
  const vacationDaysNeeded = calculateVacationDaysNeeded(start, end, holidays);
  const totalDays = differenceInDays(end, start) + 1;
  
  return {
    start: new Date(start),
    end: new Date(end),
    days: totalDays,
    vacationDaysNeeded,
    description,
    type,
    score: 0 // Default score, will be adjusted by scoring system
  };
}

// Helper: Score periods based on optimization mode and efficiency
function scorePeriods(periods: VacationPeriod[], mode: string): VacationPeriod[] {
  const scoredPeriods = [...periods];
  
  // Apply scores based on period characteristics and user preferences
  scoredPeriods.forEach(period => {
    // Use existing score as base if available
    if (!period.score) period.score = 0;
    
    // Calculate efficiency (days off per vacation day)
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    
    // Apply mode-specific scoring
    switch(mode) {
      case "longweekends":
        // Favor 2-4 day periods
        if (period.days <= 4) period.score += 40;
        else if (period.days <= 6) period.score += 20;
        else period.score -= 10;
        break;
        
      case "minibreaks":
        // Favor 4-6 day periods
        if (period.days >= 4 && period.days <= 6) period.score += 40;
        else if (period.days <= 4 || period.days <= 8) period.score += 20;
        else period.score -= 10;
        break;
        
      case "weeks":
        // Favor 7-9 day periods
        if (period.days >= 7 && period.days <= 9) period.score += 40;
        else if (period.days >= 5 && period.days <= 12) period.score += 20;
        else period.score -= 10;
        break;
        
      case "extended":
        // Favor 10+ day periods
        if (period.days >= 10) period.score += 40;
        else if (period.days >= 7) period.score += 20;
        else period.score -= 10;
        break;
        
      case "balanced":
      default:
        // Even scoring across different period lengths
        if (period.days <= 4) period.score += 20;
        else if (period.days <= 7) period.score += 25;
        else if (period.days <= 10) period.score += 30;
        else period.score += 25;
        break;
    }
    
    // Extra bonus for high-efficiency periods
    if (efficiency >= 2.0) period.score += 30;
    else if (efficiency >= 1.7) period.score += 20;
    else if (efficiency >= 1.5) period.score += 10;
    
    // Adjust score based on period type
    if (period.type === "holiday") period.score += 20;
    if (period.type === "summer") period.score += 15;
    if (period.type === "bridge") period.score += 25;
  });
  
  // Sort periods by score (higher is better)
  scoredPeriods.sort((a, b) => (b.score || 0) - (a.score || 0));
  
  return scoredPeriods;
}

// Helper: Find a specific weekday in a month
function findDayInMonth(year: number, month: number, weekNumber: number, targetDay: number): Date {
  // Start with the first day of the month
  const firstDay = new Date(year, month, 1);
  let dayOffset = targetDay - firstDay.getDay();
  
  // Adjust if negative
  if (dayOffset < 0) dayOffset += 7;
  
  // Calculate the date for the first occurrence of the target day
  const firstTargetDay = new Date(year, month, 1 + dayOffset);
  
  // Add weeks to get to the requested week
  const result = new Date(firstTargetDay);
  result.setDate(firstTargetDay.getDate() + (weekNumber - 1) * 7);
  
  return result;
}

// Helper: Get month name
function getMonthName(monthIndex: number): string {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
}

// Helper: Get holiday name based on date
function getHolidayName(holiday: Date, year: number): string {
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
  
  // Default name
  return `Helgdag ${day} ${getMonthName(month)}`;
}
