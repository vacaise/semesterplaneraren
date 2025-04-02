
import { createExtraPeriods } from './periodFinders';
import { VacationPeriod } from './types';
import { isDateInPast, isDayOff } from './helpers';

// Select the optimal periods based on the available vacation days
export const selectOptimalPeriods = (
  potentialPeriods: VacationPeriod[], 
  vacationDays: number, 
  year: number, 
  holidays: Date[], 
  mode: string
): VacationPeriod[] => {
  // Make a copy to avoid mutating the original array
  const periods = [...potentialPeriods];
  
  // Filter out periods that are entirely in the past
  const validPeriods = periods.filter(period => {
    const endDate = new Date(period.end);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return endDate >= now;
  });
  
  // Sort by efficiency (days off per vacation day needed)
  validPeriods.sort((a, b) => {
    const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
    const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
    
    // If efficiency is the same, prioritize by mode preference
    if (aEfficiency === bEfficiency) {
      return (b.score || 0) - (a.score || 0);
    }
    
    return bEfficiency - aEfficiency;
  });
  
  // Define maximum number of periods to select based on mode
  let maxPeriods = 20;
  
  if (mode === "longweekends") {
    maxPeriods = 30;
  } else if (mode === "extended") {
    maxPeriods = 10;
  }
  
  // First pass: try to select periods with extremely high efficiency
  const selectedPeriods: VacationPeriod[] = [];
  let remainingVacationDays = vacationDays;
  
  // First select periods that match the requested mode
  for (const period of validPeriods) {
    let isPreferredType = false;
    
    if (mode === "longweekends" && period.days <= 4) {
      isPreferredType = true;
    } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
      isPreferredType = true;
    } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
      isPreferredType = true;
    } else if (mode === "extended" && period.days > 9) {
      isPreferredType = true;
    } else if (mode === "balanced") {
      isPreferredType = true;
    }
    
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    
    // Only select high-efficiency periods that match the mode
    if (isPreferredType && efficiency >= 1.5 && period.vacationDaysNeeded <= remainingVacationDays) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded;
      
      // Only check max periods, don't break on remaining days
      if (selectedPeriods.length >= maxPeriods) {
        break;
      }
    }
  }
  
  // Second pass: fill in remaining vacation days with efficient periods
  if (remainingVacationDays > 0) {
    for (const period of validPeriods) {
      // Skip already selected periods
      if (selectedPeriods.some(p => 
        p.start.getTime() === period.start.getTime() && 
        p.end.getTime() === period.end.getTime()
      )) {
        continue;
      }
      
      if (period.vacationDaysNeeded <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded;
      }
      
      // Only check max periods, don't break on remaining days
      if (selectedPeriods.length >= maxPeriods) {
        break;
      }
    }
  }
  
  // Final attempt: if we still have vacation days, add extra small periods
  if (remainingVacationDays > 0) {
    const extraPeriods = createExtraPeriods(year, holidays);
    
    // Sort extra periods by efficiency (days per vacation day)
    extraPeriods.sort((a, b) => {
      const aEfficiency = a.days / Math.max(a.vacationDaysNeeded, 1);
      const bEfficiency = b.days / Math.max(b.vacationDaysNeeded, 1);
      return bEfficiency - aEfficiency;
    });
    
    for (const period of extraPeriods) {
      if (period.vacationDaysNeeded <= remainingVacationDays) {
        // Check that there's no overlap with existing periods
        const hasOverlap = selectedPeriods.some(selected => {
          return (
            (period.start >= selected.start && period.start <= selected.end) ||
            (period.end >= selected.start && period.end <= selected.end) ||
            (period.start <= selected.start && period.end >= selected.end)
          );
        });
        
        if (!hasOverlap) {
          selectedPeriods.push(period);
          remainingVacationDays -= period.vacationDaysNeeded;
        }
      }
    }
  }
  
  // Last resort: If we STILL have vacation days, create single day periods
  if (remainingVacationDays > 0) {
    const singleDayPeriods = createSingleDayPeriods(year, holidays, remainingVacationDays, selectedPeriods);
    selectedPeriods.push(...singleDayPeriods);
    remainingVacationDays -= singleDayPeriods.length;
  }
  
  // CRITICAL: If we STILL have days left after trying to use all methods,
  // modify existing single-day periods to be multi-day where possible to use up ALL days
  if (remainingVacationDays > 0) {
    const extendedPeriods = extendSingleDayPeriods(selectedPeriods, remainingVacationDays, holidays);
    if (extendedPeriods.daysUsed > 0) {
      // Replace the modified periods
      const updatedPeriods = selectedPeriods.filter(period => 
        !extendedPeriods.modifiedPeriods.some(mp => 
          mp.originalStart.getTime() === period.start.getTime()
        )
      );
      updatedPeriods.push(...extendedPeriods.newPeriods);
      remainingVacationDays -= extendedPeriods.daysUsed;
      
      // Update selectedPeriods with our updated collection
      selectedPeriods.length = 0;
      selectedPeriods.push(...updatedPeriods);
    }
  }
  
  // FINAL ABSOLUTE FALLBACK: If we STILL have days, create generic single vacation days
  // This ensures we always use EXACTLY the number of vacation days specified
  if (remainingVacationDays > 0) {
    const fallbackDays = createFallbackSingleDays(year, holidays, remainingVacationDays, selectedPeriods);
    selectedPeriods.push(...fallbackDays);
    remainingVacationDays -= fallbackDays.length;
  }
  
  // Sort the final selected periods by date (chronologically)
  selectedPeriods.sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });
  
  return selectedPeriods;
};

// Create individual single-day vacation periods to use up any remaining days
const createSingleDayPeriods = (
  year: number, 
  holidays: Date[],
  remainingDays: number,
  existingPeriods: VacationPeriod[]
): VacationPeriod[] => {
  const singleDayPeriods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Try to create Monday or Friday periods to extend weekends
  for (let month = 0; month < 12 && remainingDays > 0; month++) {
    for (let day = 1; day <= 31 && remainingDays > 0; day++) {
      try {
        const date = new Date(year, month, day);
        // Skip if not valid date, is in the past, is a weekend or holiday
        if (
          date.getMonth() !== month || 
          date < today || 
          date.getDay() === 0 || // Sunday
          date.getDay() === 6 || // Saturday
          holidays.some(h => h.getDate() === date.getDate() && h.getMonth() === date.getMonth())
        ) {
          continue;
        }
        
        // Prioritize Mondays and Fridays for long weekends
        if (date.getDay() === 1 || date.getDay() === 5) {
          // Check for overlap with existing periods
          const hasOverlap = existingPeriods.some(period => 
            date >= period.start && date <= period.end
          );
          
          if (!hasOverlap) {
            singleDayPeriods.push({
              start: new Date(date),
              end: new Date(date),
              days: 1,
              vacationDaysNeeded: 1,
              description: `Extra ledig dag: ${date.getDate()}/${date.getMonth() + 1}`,
              type: "single",
              score: 30
            });
            remainingDays--;
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    }
  }
  
  // If we still have days, add any weekday (not just Mon/Fri)
  if (remainingDays > 0) {
    for (let month = 0; month < 12 && remainingDays > 0; month++) {
      for (let day = 1; day <= 31 && remainingDays > 0; day++) {
        try {
          const date = new Date(year, month, day);
          // Skip if not valid date, is in the past, is a weekend or holiday
          if (
            date.getMonth() !== month || 
            date < today || 
            date.getDay() === 0 || // Sunday
            date.getDay() === 6 || // Saturday
            holidays.some(h => h.getDate() === date.getDate() && h.getMonth() === date.getMonth())
          ) {
            continue;
          }
          
          // Check for overlap with existing periods
          const hasOverlap = existingPeriods.some(period => 
            date >= period.start && date <= period.end
          );
          
          const alreadyAdded = singleDayPeriods.some(period => 
            period.start.getDate() === date.getDate() && 
            period.start.getMonth() === date.getMonth()
          );
          
          if (!hasOverlap && !alreadyAdded) {
            singleDayPeriods.push({
              start: new Date(date),
              end: new Date(date),
              days: 1,
              vacationDaysNeeded: 1,
              description: `Extra ledig dag: ${date.getDate()}/${date.getMonth() + 1}`,
              type: "single",
              score: 20
            });
            remainingDays--;
          }
          
          if (remainingDays <= 0) {
            break;
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    }
  }
  
  return singleDayPeriods;
};

// Try to extend single-day periods to multi-day periods to use up days
const extendSingleDayPeriods = (
  existingPeriods: VacationPeriod[],
  daysToUse: number, 
  holidays: Date[]
): { newPeriods: VacationPeriod[], modifiedPeriods: { originalStart: Date }[], daysUsed: number } => {
  const newPeriods: VacationPeriod[] = [];
  const modifiedPeriods: { originalStart: Date }[] = [];
  let daysUsed = 0;
  
  // Find single day periods that can be extended
  const singleDayPeriods = existingPeriods.filter(p => p.days === 1);
  
  // Try to extend each single day period
  for (const period of singleDayPeriods) {
    if (daysToUse <= 0) break;
    
    const originalStart = new Date(period.start);
    
    // Try to extend by 1-3 days in either direction
    for (let direction = -1; direction <= 1; direction += 2) { // -1 = before, 1 = after
      for (let extension = 1; extension <= 3; extension++) {
        if (daysToUse <= 0) break;
        
        const newDate = new Date(originalStart);
        newDate.setDate(originalStart.getDate() + (extension * direction));
        
        // Check if date is valid (not weekend, not holiday, not in an existing period)
        const isWeekend = newDate.getDay() === 0 || newDate.getDay() === 6;
        const isHoliday = holidays.some(h => 
          h.getDate() === newDate.getDate() && 
          h.getMonth() === newDate.getMonth()
        );
        const isInExistingPeriod = existingPeriods.some(p => 
          newDate >= p.start && newDate <= p.end
        );
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isInPast = newDate < today;
        
        if (!isWeekend && !isHoliday && !isInExistingPeriod && !isInPast) {
          // We can extend in this direction
          let newStart, newEnd;
          
          if (direction < 0) {
            // Extend before
            newStart = new Date(newDate);
            newEnd = new Date(originalStart);
          } else {
            // Extend after
            newStart = new Date(originalStart);
            newEnd = new Date(newDate);
          }
          
          // Calculate new period details
          const periodDays = differenceInDays(newEnd, newStart) + 1;
          
          // Count how many vacation days are needed
          let vacationDaysNeeded = 0;
          let currentDate = new Date(newStart);
          
          while (currentDate <= newEnd) {
            if (!isDayOff(currentDate, holidays)) {
              vacationDaysNeeded++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          // If we need more vacation days than we have left, skip this extension
          if (vacationDaysNeeded - 1 > daysToUse) continue; // -1 because original day already counted
          
          // Create the new extended period
          newPeriods.push({
            start: newStart,
            end: newEnd,
            days: periodDays,
            vacationDaysNeeded: vacationDaysNeeded,
            description: `Utökad ledighet: ${newStart.getDate()}/${newStart.getMonth() + 1} - ${newEnd.getDate()}/${newEnd.getMonth() + 1}`,
            type: "extended",
            score: 40
          });
          
          // Mark original period as modified
          modifiedPeriods.push({
            originalStart: originalStart
          });
          
          // Update days used (subtract 1 because the original day was already counted)
          daysUsed += vacationDaysNeeded - 1;
          daysToUse -= vacationDaysNeeded - 1;
          
          // Once we've extended a period, break out of the loops
          break;
        }
      }
      
      // If we've modified this period already, don't try the other direction
      if (modifiedPeriods.some(mp => mp.originalStart.getTime() === originalStart.getTime())) {
        break;
      }
    }
  }
  
  return { newPeriods, modifiedPeriods, daysUsed };
};

// Helper for differenceInDays since it's used here but imported elsewhere
const differenceInDays = (end: Date, start: Date): number => {
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Create absolute fallback single days - this is the final resort to ensure all vacation days are used
const createFallbackSingleDays = (
  year: number, 
  holidays: Date[],
  remainingDays: number,
  existingPeriods: VacationPeriod[]
): VacationPeriod[] => {
  const fallbackPeriods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Try every single weekday in the year until we use all days
  const workdays: Date[] = [];
  
  // Collect all available workdays in the year
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      try {
        const date = new Date(year, month, day);
        
        // Skip invalid dates, past dates, weekends, holidays, and days already in periods
        if (
          date.getMonth() !== month || 
          date < today ||
          date.getDay() === 0 || // Sunday
          date.getDay() === 6 || // Saturday
          holidays.some(h => isSameDay(h, date)) ||
          existingPeriods.some(p => date >= p.start && date <= p.end)
        ) {
          continue;
        }
        
        workdays.push(date);
      } catch (e) {
        // Skip invalid dates
      }
    }
  }
  
  // Sort workdays by month (distribute throughout the year)
  workdays.sort((a, b) => {
    // First by month
    if (a.getMonth() !== b.getMonth()) {
      return a.getMonth() - b.getMonth();
    }
    // Then by day of month
    return a.getDate() - b.getDate();
  });
  
  // Add fallback days evenly distributed across the year
  const step = Math.max(1, Math.floor(workdays.length / remainingDays));
  
  for (let i = 0; i < workdays.length && fallbackPeriods.length < remainingDays; i += step) {
    const date = workdays[i];
    
    fallbackPeriods.push({
      start: new Date(date),
      end: new Date(date),
      days: 1,
      vacationDaysNeeded: 1,
      description: `Semester: ${date.getDate()}/${date.getMonth() + 1}`,
      type: "fallback",
      score: 10
    });
  }
  
  // If we still haven't used all days, just take consecutive days
  if (fallbackPeriods.length < remainingDays) {
    for (let i = 0; i < workdays.length && fallbackPeriods.length < remainingDays; i++) {
      const date = workdays[i];
      
      // Skip if we already added this day
      if (fallbackPeriods.some(p => isSameDay(p.start, date))) {
        continue;
      }
      
      fallbackPeriods.push({
        start: new Date(date),
        end: new Date(date),
        days: 1,
        vacationDaysNeeded: 1,
        description: `Semester: ${date.getDate()}/${date.getMonth() + 1}`,
        type: "fallback",
        score: 5
      });
    }
  }
  
  return fallbackPeriods;
};

// Helper function for date comparison
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
};
