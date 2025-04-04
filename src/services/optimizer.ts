import { Break, CompanyDayOff, OptimizationParams, OptimizationResult, OptimizationStats, OptimizationStrategy, OptimizedDay } from '@/types';
import { format, parse, addDays, isSameDay } from 'date-fns';

/**
 * Create a schedule of all days in the given year with their properties
 */
function createYearSchedule(year: number, publicHolidays: Array<{ date: string; name: string }>, companyDaysOff: Array<CompanyDayOff>): OptimizedDay[] {
  // Get today's date
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Use January 1 of the selected year as start date for future years
  const scheduleStartDate = year > today.getFullYear() 
    ? new Date(year, 0, 1) 
    : startDate;
  
  // End date is always December 31 of the selected year
  const scheduleEndDate = new Date(year, 11, 31);
  
  // Create array of all days in the year, starting from today or January 1
  const days = eachDayOfInterval({
    start: scheduleStartDate,
    end: scheduleEndDate,
  });

  // Map days to OptimizedDay objects
  return days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const isPublicHoliday = publicHolidays.some(holiday => holiday.date === dateStr);
    const isCompanyDayOff = companyDaysOff.some(companyDay => companyDay.date === dateStr);
    
    return {
      date: dateStr,
      isWeekend: isWeekend(day),
      isPublicHoliday,
      publicHolidayName: isPublicHoliday 
        ? publicHolidays.find(holiday => holiday.date === dateStr)?.name 
        : undefined,
      isCompanyDayOff,
      companyDayName: isCompanyDayOff 
        ? companyDaysOff.find(companyDay => companyDay.date === dateStr)?.name 
        : undefined,
      isPTO: false, // Will be set during optimization
      isPartOfBreak: false, // Will be set during break detection
    };
  });
}

/**
 * Find optimal PTO days based on the selected strategy
 */
function applyOptimizationStrategy(
  days: OptimizedDay[], 
  strategy: OptimizationStrategy,
  maxPTODays: number
): OptimizedDay[] {
  // Clone the days array to avoid modifying the original
  const optimizedDays = [...days];
  const workDays = optimizedDays.filter(day => 
    !day.isWeekend && !day.isPublicHoliday && !day.isCompanyDayOff
  );
  
  let ptoRemaining = maxPTODays;
  
  // Different algorithms based on strategy
  switch (strategy) {
    case 'balanced': {
      // Balanced approach - prioritize long weekends but also create mid-week breaks
      // First, create long weekends (Fridays and Mondays)
      const fridaysAndMondays = workDays.filter(day => {
        const date = parseISO(day.date);
        const dayOfWeek = getDay(date);
        return dayOfWeek === 1 || dayOfWeek === 5; // Monday or Friday
      });

      // Then, consider Wednesday breaks to split the week
      const wednesdays = workDays.filter(day => {
        const date = parseISO(day.date);
        const dayOfWeek = getDay(date);
        return dayOfWeek === 3; // Wednesday
      });
      
      // Use 60% of days for long weekends
      const longWeekendDays = Math.ceil(ptoRemaining * 0.6);
      // Use 40% of days for mid-week breaks
      const midWeekDays = ptoRemaining - longWeekendDays;
      
      // Apply to Fridays and Mondays first
      for (let i = 0; i < fridaysAndMondays.length && ptoRemaining > midWeekDays; i += 2) {
        const day = fridaysAndMondays[i];
        const index = optimizedDays.findIndex(d => d.date === day.date);
        if (index !== -1) {
          optimizedDays[index].isPTO = true;
          ptoRemaining--;
        }
      }
      
      // Then apply to Wednesdays
      for (let i = 0; i < wednesdays.length && ptoRemaining > 0; i += 2) {
        const day = wednesdays[i];
        const index = optimizedDays.findIndex(d => d.date === day.date);
        if (index !== -1) {
          optimizedDays[index].isPTO = true;
          ptoRemaining--;
        }
      }
      
      // Use remaining days on any workdays that aren't PTO yet
      const remainingWorkdays = workDays.filter(day => {
        const index = optimizedDays.findIndex(d => d.date === day.date);
        return index !== -1 && !optimizedDays[index].isPTO;
      });
      
      for (let i = 0; i < remainingWorkdays.length && ptoRemaining > 0; i++) {
        const day = remainingWorkdays[i];
        const index = optimizedDays.findIndex(d => d.date === day.date);
        if (index !== -1) {
          optimizedDays[index].isPTO = true;
          ptoRemaining--;
        }
      }
      
      break;
    }
    
    case 'longWeekends': {
      // Create as many 3-4 day weekends as possible
      // Prioritize Fridays and Mondays
      const longWeekendOptions = workDays.filter(day => {
        const date = parseISO(day.date);
        const dayOfWeek = getDay(date);
        return dayOfWeek === 1 || dayOfWeek === 5; // Monday or Friday
      });
      
      // Apply PTO to create long weekends
      for (let i = 0; i < longWeekendOptions.length && ptoRemaining > 0; i++) {
        const day = longWeekendOptions[i];
        const index = optimizedDays.findIndex(d => d.date === day.date);
        if (index !== -1) {
          optimizedDays[index].isPTO = true;
          ptoRemaining--;
        }
      }
      
      // If we still have days, look at Thursdays and Tuesdays
      if (ptoRemaining > 0) {
        const extendedWeekendOptions = workDays.filter(day => {
          const date = parseISO(day.date);
          const dayOfWeek = getDay(date);
          return dayOfWeek === 2 || dayOfWeek === 4; // Tuesday or Thursday
        });
        
        for (let i = 0; i < extendedWeekendOptions.length && ptoRemaining > 0; i++) {
          const day = extendedWeekendOptions[i];
          const index = optimizedDays.findIndex(d => d.date === day.date);
          if (index !== -1) {
            optimizedDays[index].isPTO = true;
            ptoRemaining--;
          }
        }
      }
      
      break;
    }
    
    case 'miniBreaks': {
      // Create 5-6 day breaks
      // We'll look for blocks of workdays that are close to holidays or weekends
      let i = 0;
      
      while (ptoRemaining > 0 && i < optimizedDays.length - 5) {
        // Look for good starting points - a day off followed by work days
        if ((optimizedDays[i].isWeekend || optimizedDays[i].isPublicHoliday || 
             optimizedDays[i].isCompanyDayOff) && 
            (!optimizedDays[i+1].isWeekend && !optimizedDays[i+1].isPublicHoliday && 
             !optimizedDays[i+1].isCompanyDayOff)) {
          
          // Look ahead to see if we can create a 5-6 day break
          const breakLength = Math.min(5, ptoRemaining);
          let j = 1;
          
          // Apply PTO to consecutive workdays
          while (j <= breakLength && i+j < optimizedDays.length && ptoRemaining > 0) {
            if (!optimizedDays[i+j].isWeekend && !optimizedDays[i+j].isPublicHoliday && 
                !optimizedDays[i+j].isCompanyDayOff) {
              optimizedDays[i+j].isPTO = true;
              ptoRemaining--;
            }
            j++;
          }
          
          // Skip ahead past this break
          i += j + 1;
        } else {
          i++;
        }
      }
      
      // Use any remaining days on individual long weekends
      if (ptoRemaining > 0) {
        const longWeekendOptions = workDays.filter(day => {
          const date = parseISO(day.date);
          const dayOfWeek = getDay(date);
          return (dayOfWeek === 1 || dayOfWeek === 5) && !day.isPTO;
        });
        
        for (let i = 0; i < longWeekendOptions.length && ptoRemaining > 0; i++) {
          const day = longWeekendOptions[i];
          const index = optimizedDays.findIndex(d => d.date === day.date);
          if (index !== -1) {
            optimizedDays[index].isPTO = true;
            ptoRemaining--;
          }
        }
      }
      
      break;
    }
    
    case 'weekLongBreaks': {
      // Create 7-9 day vacation periods
      // Aim for fewer, longer breaks
      const targetBreakLength = 7; // 7 days (including weekends)
      const ptoPerBreak = 5; // typical work days in a week
      
      // Calculate how many breaks we can create
      const numBreaks = Math.floor(ptoRemaining / ptoPerBreak);
      
      // Distribute breaks throughout the year
      const daysPerBreak = Math.floor(optimizedDays.length / (numBreaks + 1));
      
      for (let breakNum = 1; breakNum <= numBreaks && ptoRemaining >= 5; breakNum++) {
        // Find a good starting point for this break
        // Aim for position that's 1/4, 2/4, 3/4, etc. through the year
        const targetIndex = Math.min(
          Math.floor(breakNum * daysPerBreak), 
          optimizedDays.length - targetBreakLength
        );
        
        // Look for a weekend near this target to start with
        let startIndex = -1;
        
        // Search backward and forward for a weekend
        for (let offset = 0; offset < 14 && startIndex === -1; offset++) {
          // Try before target
          if (targetIndex - offset >= 0 && 
              optimizedDays[targetIndex - offset].isWeekend) {
            startIndex = targetIndex - offset;
          }
          // Try after target
          else if (targetIndex + offset < optimizedDays.length && 
                  optimizedDays[targetIndex + offset].isWeekend) {
            startIndex = targetIndex + offset;
          }
        }
        
        // If we found a good starting point
        if (startIndex !== -1) {
          // Find first workday after the weekend
          let firstWorkday = startIndex;
          while (firstWorkday < optimizedDays.length && 
                (optimizedDays[firstWorkday].isWeekend || 
                 optimizedDays[firstWorkday].isPublicHoliday || 
                 optimizedDays[firstWorkday].isCompanyDayOff)) {
            firstWorkday++;
          }
          
          // Apply PTO to workdays
          let ptoApplied = 0;
          let currentIndex = firstWorkday;
          
          while (ptoApplied < ptoPerBreak && ptoRemaining > 0 && 
                 currentIndex < optimizedDays.length) {
            if (!optimizedDays[currentIndex].isWeekend && 
                !optimizedDays[currentIndex].isPublicHoliday && 
                !optimizedDays[currentIndex].isCompanyDayOff) {
              optimizedDays[currentIndex].isPTO = true;
              ptoRemaining--;
              ptoApplied++;
            }
            currentIndex++;
          }
        }
      }
      
      // Use any remaining days on long weekends
      if (ptoRemaining > 0) {
        const longWeekendOptions = workDays.filter(day => {
          const date = parseISO(day.date);
          const dayOfWeek = getDay(date);
          return (dayOfWeek === 1 || dayOfWeek === 5) && !day.isPTO;
        });
        
        for (let i = 0; i < longWeekendOptions.length && ptoRemaining > 0; i++) {
          const day = longWeekendOptions[i];
          const index = optimizedDays.findIndex(d => d.date === day.date);
          if (index !== -1) {
            optimizedDays[index].isPTO = true;
            ptoRemaining--;
          }
        }
      }
      
      break;
    }
    
    case 'extendedVacations': {
      // Create longer 10-15 day vacation periods
      // Typically use all PTO for 1-3 extended trips
      const targetBreakLength = 14; // Two weeks
      const workdaysPerBreak = 10; // Two weeks of workdays
      
      // Calculate how many breaks we can create
      const numBreaks = Math.max(1, Math.floor(ptoRemaining / workdaysPerBreak));
      const daysPerBreak = Math.min(
        workdaysPerBreak, 
        Math.floor(ptoRemaining / numBreaks)
      );
      
      for (let breakNum = 1; breakNum <= numBreaks && ptoRemaining >= daysPerBreak; breakNum++) {
        // Find evenly spaced starting points
        const targetIndex = Math.min(
          Math.floor((breakNum * optimizedDays.length) / (numBreaks + 1)), 
          optimizedDays.length - targetBreakLength
        );
        
        // Look for a weekend near this target to start with
        let startIndex = -1;
        
        // Search backward and forward for a weekend
        for (let offset = 0; offset < 14 && startIndex === -1; offset++) {
          // Try before target
          if (targetIndex - offset >= 0 && 
              optimizedDays[targetIndex - offset].isWeekend) {
            startIndex = targetIndex - offset;
          }
          // Try after target
          else if (targetIndex + offset < optimizedDays.length && 
                  optimizedDays[targetIndex + offset].isWeekend) {
            startIndex = targetIndex + offset;
          }
        }
        
        // If we found a good starting point
        if (startIndex !== -1) {
          // Find Monday after the weekend
          let firstWorkday = startIndex;
          while (firstWorkday < optimizedDays.length && 
                (optimizedDays[firstWorkday].isWeekend || 
                 optimizedDays[firstWorkday].isPublicHoliday || 
                 optimizedDays[firstWorkday].isCompanyDayOff)) {
            firstWorkday++;
          }
          
          // Apply PTO to consecutive workdays
          let ptoApplied = 0;
          let currentIndex = firstWorkday;
          
          while (ptoApplied < daysPerBreak && ptoRemaining > 0 && 
                 currentIndex < optimizedDays.length) {
            if (!optimizedDays[currentIndex].isWeekend && 
                !optimizedDays[currentIndex].isPublicHoliday && 
                !optimizedDays[currentIndex].isCompanyDayOff) {
              optimizedDays[currentIndex].isPTO = true;
              ptoRemaining--;
              ptoApplied++;
            }
            currentIndex++;
          }
        }
      }
      
      break;
    }
  }
  
  return optimizedDays;
}

/**
 * Identify breaks in the schedule
 */
function findBreaks(days: OptimizedDay[]): Break[] {
  const breaks: Break[] = [];
  
  if (days.length === 0) return breaks;
  
  // Helper function to check if a day is a day off (weekend, holiday, PTO, or company day)
  const isDayOff = (day: OptimizedDay) => 
    day.isWeekend || day.isPublicHoliday || day.isPTO || day.isCompanyDayOff;
  
  let currentBreak: OptimizedDay[] = [];
  let inBreak = false;
  
  // Scan through all days to find continuous breaks
  days.forEach((day, index) => {
    const isDayOffToday = isDayOff(day);
    
    // Check if this is the start of a break
    if (isDayOffToday && !inBreak) {
      inBreak = true;
      currentBreak = [day];
    } 
    // Continue a break
    else if (isDayOffToday && inBreak) {
      currentBreak.push(day);
    } 
    // End of a break
    else if (!isDayOffToday && inBreak) {
      // Check if break is at least 3 days long
      if (currentBreak.length >= 3) {
        // Mark all days in this break
        currentBreak.forEach(breakDay => {
          const dayIndex = days.findIndex(d => d.date === breakDay.date);
          if (dayIndex !== -1) {
            days[dayIndex].isPartOfBreak = true;
          }
        });
        
        // Calculate break statistics
        const ptoDays = currentBreak.filter(d => d.isPTO).length;
        const publicHolidays = currentBreak.filter(d => d.isPublicHoliday).length;
        const weekends = currentBreak.filter(d => d.isWeekend).length;
        const companyDaysOff = currentBreak.filter(d => d.isCompanyDayOff).length;
        
        // Create a break object
        breaks.push({
          startDate: currentBreak[0].date,
          endDate: currentBreak[currentBreak.length - 1].date,
          days: currentBreak,
          totalDays: currentBreak.length,
          ptoDays,
          publicHolidays,
          weekends,
          companyDaysOff
        });
      }
      
      // Reset for next break
      inBreak = false;
      currentBreak = [];
    }
    
    // Handle the last day in the array
    if (isDayOffToday && inBreak && index === days.length - 1) {
      if (currentBreak.length >= 3) {
        // Mark all days in this break
        currentBreak.forEach(breakDay => {
          const dayIndex = days.findIndex(d => d.date === breakDay.date);
          if (dayIndex !== -1) {
            days[dayIndex].isPartOfBreak = true;
          }
        });
        
        // Calculate break statistics
        const ptoDays = currentBreak.filter(d => d.isPTO).length;
        const publicHolidays = currentBreak.filter(d => d.isPublicHoliday).length;
        const weekends = currentBreak.filter(d => d.isWeekend).length;
        const companyDaysOff = currentBreak.filter(d => d.isCompanyDayOff).length;
        
        // Create a break object
        breaks.push({
          startDate: currentBreak[0].date,
          endDate: currentBreak[currentBreak.length - 1].date,
          days: currentBreak,
          totalDays: currentBreak.length,
          ptoDays,
          publicHolidays,
          weekends,
          companyDaysOff
        });
      }
    }
  });
  
  // Sort breaks by start date
  return breaks.sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

/**
 * Calculate overall statistics
 */
function calculateStats(days: OptimizedDay[], breaks: Break[]): OptimizationStats {
  // Calculate overall stats
  const totalPTODays = days.filter(day => day.isPTO).length;
  const totalPublicHolidays = days.filter(day => day.isPublicHoliday).length;
  const totalNormalWeekends = days.filter(day => day.isWeekend && !day.isPartOfBreak).length;
  const totalCompanyDaysOff = days.filter(day => day.isCompanyDayOff).length;
  
  // Count extended weekends (3-4 day breaks)
  const totalExtendedWeekends = breaks.filter(b => b.totalDays >= 3 && b.totalDays <= 4).length;
  
  // Total days off is the sum of PTO, holidays, weekends, and company days
  const totalDaysOff = totalPTODays + totalPublicHolidays + 
                       days.filter(day => day.isWeekend).length + totalCompanyDaysOff;
  
  return {
    totalPTODays,
    totalPublicHolidays,
    totalNormalWeekends,
    totalCompanyDaysOff,
    totalDaysOff,
    totalExtendedWeekends
  };
}

/**
 * Main optimization function - takes parameters and returns optimized days, breaks, and stats
 */
export async function optimizeDaysAsync(params: OptimizationParams): Promise<OptimizationResult> {
  // Use a small delay to show the loading state
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // First, create a year schedule with all days
    const days = createYearSchedule(
      params.year,
      params.holidays,
      params.companyDaysOff
    );
    
    // Apply the optimization strategy to assign PTO days
    const optimizedDays = applyOptimizationStrategy(
      days,
      params.strategy,
      params.numberOfDays
    );
    
    // Find breaks in the schedule
    const breaks = findBreaks(optimizedDays);
    
    // Calculate overall statistics
    const stats = calculateStats(optimizedDays, breaks);
    
    return {
      days: optimizedDays,
      breaks,
      stats
    };
  } catch (error) {
    console.error('Optimization error:', error);
    throw new Error('Failed to optimize schedule');
  }
}
