
import { addDays, differenceInDays } from 'date-fns';
import { isDayOff } from '../helpers';

// Find summer vacation periods
export const findSummerPeriods = (year: number, holidays: Date[]) => {
  const periods = [];
  
  // July vacation options (different lengths)
  const julyOptions = [
    { start: 1, end: 21, weeks: 3, description: "Sommarsemester i juli (3 veckor)" },
    { start: 8, end: 21, weeks: 2, description: "Sommarsemester i juli (2 veckor)" },
    { start: 1, end: 14, weeks: 2, description: "Sommarsemester i början av juli" },
    { start: 15, end: 28, weeks: 2, description: "Sommarsemester i slutet av juli" }
  ];
  
  julyOptions.forEach(option => {
    const julyStart = new Date(year, 6, option.start);
    const julyEnd = new Date(year, 6, option.end);
    
    // Adjust to start and end on a good weekday
    let julyStartDate = new Date(julyStart);
    while (julyStartDate.getDay() !== 1) { // Start on a Monday
      julyStartDate = addDays(julyStartDate, 1);
    }
    
    let julyEndDate = new Date(julyEnd);
    while (julyEndDate.getDay() !== 0) { // End on a Sunday
      julyEndDate = addDays(julyEndDate, 1);
    }
    
    // Calculate vacation days needed
    let julyDaysNeeded = 0;
    const julyCurrentDay = new Date(julyStartDate);
    while (julyCurrentDay <= julyEndDate) {
      if (!isDayOff(julyCurrentDay, holidays)) {
        julyDaysNeeded++;
      }
      julyCurrentDay.setDate(julyCurrentDay.getDate() + 1);
    }
    
    periods.push({
      start: julyStartDate,
      end: julyEndDate,
      days: differenceInDays(julyEndDate, julyStartDate) + 1,
      vacationDaysNeeded: julyDaysNeeded,
      description: option.description,
      score: 82 - (3 - option.weeks) * 5, // Score based on length
      type: "summer"
    });
  });
  
  // August vacation options
  const augustOptions = [
    { start: 1, end: 14, weeks: 2, description: "Sommarsemester i början av augusti" },
    { start: 8, end: 21, weeks: 2, description: "Sommarsemester i mitten av augusti" },
    { start: 15, end: 28, weeks: 2, description: "Sommarsemester i slutet av augusti" }
  ];
  
  augustOptions.forEach(option => {
    const augStart = new Date(year, 7, option.start);
    const augEnd = new Date(year, 7, option.end);
    
    // Adjust to start and end on a good weekday
    let augStartDate = new Date(augStart);
    while (augStartDate.getDay() !== 1) { // Start on a Monday
      augStartDate = addDays(augStartDate, 1);
    }
    
    let augEndDate = new Date(augEnd);
    while (augEndDate.getDay() !== 0) { // End on a Sunday
      augEndDate = addDays(augEndDate, 1);
    }
    
    // Calculate vacation days needed
    let augDaysNeeded = 0;
    const augCurrentDay = new Date(augStartDate);
    while (augCurrentDay <= augEndDate) {
      if (!isDayOff(augCurrentDay, holidays)) {
        augDaysNeeded++;
      }
      augCurrentDay.setDate(augCurrentDay.getDate() + 1);
    }
    
    periods.push({
      start: augStartDate,
      end: augEndDate,
      days: differenceInDays(augEndDate, augStartDate) + 1,
      vacationDaysNeeded: augDaysNeeded,
      description: option.description,
      score: 78,
      type: "summer"
    });
  });
  
  // June vacation option (before midsummer)
  const juneStart = new Date(year, 5, 10);
  const juneEnd = new Date(year, 5, 18);
  
  // Adjust to start and end on a good weekday
  let juneStartDate = new Date(juneStart);
  while (juneStartDate.getDay() !== 1) { // Start on a Monday
    juneStartDate = addDays(juneStartDate, 1);
  }
  
  let juneEndDate = new Date(juneEnd);
  while (juneEndDate.getDay() !== 0) { // End on a Sunday
    juneEndDate = addDays(juneEndDate, 1);
  }
  
  // Calculate vacation days needed
  let juneDaysNeeded = 0;
  const juneCurrentDay = new Date(juneStartDate);
  while (juneCurrentDay <= juneEndDate) {
    if (!isDayOff(juneCurrentDay, holidays)) {
      juneDaysNeeded++;
    }
    juneCurrentDay.setDate(juneCurrentDay.getDate() + 1);
  }
  
  periods.push({
    start: juneStartDate,
    end: juneEndDate,
    days: differenceInDays(juneEndDate, juneStartDate) + 1,
    vacationDaysNeeded: juneDaysNeeded,
    description: "Försommarsemester i juni",
    score: 75,
    type: "summer"
  });
  
  return periods;
};
