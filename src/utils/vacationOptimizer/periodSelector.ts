
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
  
  // Primary Sort: Sort by score (mode preference and efficiency)
  validPeriods.sort((a, b) => {
    return (b.score || 0) - (a.score || 0);
  });
  
  // Define maximum number of periods to select based on mode
  let maxPeriods = 10; // Default
  
  if (mode === "longweekends") {
    maxPeriods = 20; // More shorter periods for long weekends
  } else if (mode === "minibreaks") {
    maxPeriods = 15; // Moderate number for mini-breaks
  } else if (mode === "weeks") {
    maxPeriods = 8; // Fewer, week-long breaks
  } else if (mode === "extended") {
    maxPeriods = 5; // Very few long periods
  }
  
  // First pass: select periods that match the mode with high score
  const selectedPeriods: VacationPeriod[] = [];
  let remainingVacationDays = vacationDays;
  
  // First select high-priority periods that match the requested mode
  for (const period of validPeriods) {
    // Skip if period uses more days than we have left
    if (period.vacationDaysNeeded > remainingVacationDays) {
      continue;
    }
    
    // Check if this period overlaps with already selected periods
    const hasOverlap = selectedPeriods.some(selected => {
      return (
        (period.start >= selected.start && period.start <= selected.end) ||
        (period.end >= selected.start && period.end <= selected.end) ||
        (selected.start >= period.start && selected.start <= period.end) ||
        (selected.end >= period.start && selected.end <= period.end)
      );
    });
    
    if (!hasOverlap) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded;
      
      // Break if we've hit our target or run out of vacation days
      if (selectedPeriods.length >= maxPeriods || remainingVacationDays <= 0) {
        break;
      }
    }
  }
  
  // Second pass: try to add individual days to exactly match the vacation day count
  if (remainingVacationDays > 0 && useExactDays) {
    // First try to add strategic individual days (bridge days, etc.)
    const singleDays = createSingleDayPeriods(year, holidays, remainingVacationDays, selectedPeriods);
    
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

// Create single-day periods with strategic value
const createSingleDayPeriods = (
  year: number, 
  holidays: Date[], 
  daysNeeded: number,
  existingPeriods: VacationPeriod[]
): VacationPeriod[] => {
  const singleDays: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Array of dates to check for strategic importance
  const allDates = [];
  for (let month = today.getMonth(); month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      
      // Skip if invalid date
      if (date.getMonth() !== month) continue;
      
      // Skip if in the past
      if (date < today) continue;
      
      // Skip if it's already a day off
      if (isDayOff(date, holidays)) continue;
      
      allDates.push(new Date(date));
    }
  }
  
  // Find strategic single days - Prioritize days between holidays/weekends
  for (let i = 1; i < allDates.length - 1; i++) {
    const yesterday = allDates[i-1];
    const today = allDates[i];
    const tomorrow = allDates[i+1];
    
    // Skip already skipped dates
    if (isDayOff(today, holidays)) continue;
    
    // Check if this day would create a bridge between days off
    const yesterdayOff = isDayOff(yesterday, holidays);
    const tomorrowOff = isDayOff(tomorrow, holidays);
    
    if (yesterdayOff && tomorrowOff) {
      // Bridge day between two days off - highest priority
      singleDays.push({
        start: new Date(today),
        end: new Date(today),
        days: 1,
        vacationDaysNeeded: 1,
        description: `Klämdag ${today.getDate()}/${today.getMonth() + 1}`,
        type: "bridge",
        score: 95
      });
    } else if (yesterdayOff || tomorrowOff) {
      // Day next to a day off - medium priority
      singleDays.push({
        start: new Date(today),
        end: new Date(today),
        days: 1,
        vacationDaysNeeded: 1,
        description: `Förlängd helg ${today.getDate()}/${today.getMonth() + 1}`,
        type: "weekend",
        score: 80
      });
    }
    
    // Stop if we have enough days
    if (singleDays.length >= daysNeeded * 2) break; // Generate extra for selection
  }
  
  // Sort by score
  singleDays.sort((a, b) => (b.score || 0) - (a.score || 0));
  
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
  
  // Prioritize Mondays and Fridays first to create long weekends
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
      // Add this day as a vacation day
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
