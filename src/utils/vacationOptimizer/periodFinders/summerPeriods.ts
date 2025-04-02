
import { addDays, differenceInDays } from 'date-fns';

// Find summer vacation periods
export const findSummerPeriods = (year: number) => {
  const periods = [];
  
  // July vacation (3 weeks)
  const julyStart = new Date(year, 6, 1);
  const julyEnd = new Date(year, 6, 21);
  
  // Adjust to start and end on a good weekday
  let julyStartDate = new Date(julyStart);
  while (julyStartDate.getDay() !== 1) { // Start on a Monday
    julyStartDate = addDays(julyStartDate, 1);
  }
  
  let julyEndDate = new Date(julyEnd);
  while (julyEndDate.getDay() !== 0) { // End on a Sunday
    julyEndDate = addDays(julyEndDate, 1);
  }
  
  const julySummerPeriod = {
    start: julyStartDate,
    end: julyEndDate,
    days: differenceInDays(julyEndDate, julyStartDate) + 1,
    vacationDaysNeeded: 15,
    description: "Sommarsemester i juli",
    score: 82,
    type: "summer"
  };
  
  // August vacation (2 weeks)
  const augustStart = new Date(year, 7, 1);
  const augustEnd = new Date(year, 7, 14);
  
  // Adjust to start and end on a good weekday
  let augustStartDate = new Date(augustStart);
  while (augustStartDate.getDay() !== 1) { // Start on a Monday
    augustStartDate = addDays(augustStartDate, 1);
  }
  
  let augustEndDate = new Date(augustEnd);
  while (augustEndDate.getDay() !== 0) { // End on a Sunday
    augustEndDate = addDays(augustEndDate, 1);
  }
  
  const augustSummerPeriod = {
    start: augustStartDate,
    end: augustEndDate,
    days: differenceInDays(augustEndDate, augustStartDate) + 1,
    vacationDaysNeeded: 10,
    description: "Sommarsemester i augusti",
    score: 78,
    type: "summer"
  };
  
  periods.push(julySummerPeriod, augustSummerPeriod);
  return periods;
};
