
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
  let maxPeriods = 20; // Increased from 10
  
  if (mode === "longweekends") {
    maxPeriods = 30; // Increased from 15
  } else if (mode === "extended") {
    maxPeriods = 10; // Increased from 5
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
