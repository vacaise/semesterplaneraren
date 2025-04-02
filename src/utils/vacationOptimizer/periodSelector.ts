
import { createExtraPeriods } from './periodFinders';
import { VacationPeriod } from './types';
import { isDateInPast, isDayOff } from './helpers';

// Select the optimal periods based on the available vacation days
export const selectOptimalPeriods = (
  potentialPeriods: VacationPeriod[], 
  vacationDays: number, 
  year: number, 
  holidays: Date[], 
  mode: string,
  useExactDays = false
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
  let maxPeriods = 10; // Default
  
  if (mode === "longweekends") {
    maxPeriods = 15; // More shorter periods
  } else if (mode === "extended") {
    maxPeriods = 5; // Fewer longer periods
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
      
      // If we've hit our target or run out of vacation days, break
      if (selectedPeriods.length >= maxPeriods || remainingVacationDays <= 0) {
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
      
      // If we've hit our target or run out of vacation days, break
      if (selectedPeriods.length >= maxPeriods || remainingVacationDays <= 0) {
        break;
      }
    }
  }
  
  // Final attempt: if we still have vacation days and need to use all days
  if (remainingVacationDays > 0 && useExactDays) {
    // Try to add individual days to use up all vacation days
    const singleDays = createSingleDayPeriods(year, holidays, remainingVacationDays);
    
    for (const singleDay of singleDays) {
      // Check that there's no overlap with existing periods
      const hasOverlap = selectedPeriods.some(selected => {
        return (
          (singleDay.start >= selected.start && singleDay.start <= selected.end) ||
          (singleDay.end >= selected.start && singleDay.end <= selected.end)
        );
      });
      
      if (!hasOverlap && remainingVacationDays > 0) {
        selectedPeriods.push(singleDay);
        remainingVacationDays--;
      }
      
      if (remainingVacationDays <= 0) break;
    }
  }
  
  // If we still have vacation days and need to use all days, add any remaining days
  // as individual vacation days
  if (remainingVacationDays > 0 && useExactDays) {
    const additionalDays = createRemainingDayPeriods(year, holidays, remainingVacationDays, selectedPeriods);
    selectedPeriods.push(...additionalDays);
    remainingVacationDays = 0; // All days are now used
  }
  
  // Sort the final selected periods by date (chronologically)
  selectedPeriods.sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });
  
  return selectedPeriods;
};

// Create single-day periods to use up any remaining vacation days
const createSingleDayPeriods = (year: number, holidays: Date[], daysNeeded: number): VacationPeriod[] => {
  const singleDays: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start from today and go forward
  const startDate = new Date(today);
  
  // Try to find days that are workdays (not weekends or holidays)
  // and create single-day vacation periods for them
  for (let i = 0; i < 365 && singleDays.length < daysNeeded; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Skip if it's already a day off
    if (isDayOff(currentDate, holidays)) continue;
    
    // Skip December 24-26 and December 31-January 1 (common holiday periods)
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    if ((month === 11 && (day >= 24 && day <= 26)) || 
        (month === 11 && day === 31) || 
        (month === 0 && day === 1)) {
      continue;
    }
    
    // Create a single-day period
    singleDays.push({
      start: new Date(currentDate),
      end: new Date(currentDate),
      days: 1,
      vacationDaysNeeded: 1,
      description: `Extra ledig dag ${currentDate.getDate()}/${currentDate.getMonth() + 1}`,
      type: "single",
      score: 20
    });
  }
  
  return singleDays;
};

// Create any remaining day periods to exactly use all vacation days
const createRemainingDayPeriods = (
  year: number, 
  holidays: Date[], 
  daysNeeded: number,
  existingPeriods: VacationPeriod[]
): VacationPeriod[] => {
  const remainingDays: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Try to add workdays that don't overlap with existing periods
  // Focus on Mondays and Fridays first to create long weekends
  const daysToCheck = [];
  
  // Add all potential Mondays and Fridays for the rest of the year
  for (let month = today.getMonth(); month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      
      // Skip if invalid date or in the past
      if (date.getMonth() !== month || date < today) continue;
      
      const dayOfWeek = date.getDay();
      
      // Prioritize Mondays (1) and Fridays (5)
      if (dayOfWeek === 1 || dayOfWeek === 5) {
        daysToCheck.push(new Date(date));
      }
    }
  }
  
  // Then add other weekdays
  for (let month = today.getMonth(); month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      
      // Skip if invalid date or in the past
      if (date.getMonth() !== month || date < today) continue;
      
      const dayOfWeek = date.getDay();
      
      // Add Tuesday (2), Wednesday (3), Thursday (4)
      if (dayOfWeek >= 2 && dayOfWeek <= 4) {
        daysToCheck.push(new Date(date));
      }
    }
  }
  
  // Sort days by date
  daysToCheck.sort((a, b) => a.getTime() - b.getTime());
  
  // Check each potential day
  for (const date of daysToCheck) {
    // Skip if we've added enough days
    if (remainingDays.length >= daysNeeded) break;
    
    // Skip if it's already a day off
    if (isDayOff(date, holidays)) continue;
    
    // Check for overlap with existing periods
    const hasOverlap = existingPeriods.some(period => {
      return date >= period.start && date <= period.end;
    });
    
    if (!hasOverlap) {
      remainingDays.push({
        start: new Date(date),
        end: new Date(date),
        days: 1,
        vacationDaysNeeded: 1,
        description: `Extra semesterdag ${date.getDate()}/${date.getMonth() + 1}`,
        type: "single",
        score: 10
      });
    }
  }
  
  return remainingDays;
};
