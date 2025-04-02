
import { addDays, differenceInDays } from 'date-fns';
import { VacationPeriod } from '../types';
import { isDayOff } from '../helpers';

// Find bridge days between holidays and weekends
export const findBridgeDays = (year: number, holidays: Date[]) => {
  const periods: VacationPeriod[] = [];
  
  // May Day (May 1)
  const mayFirst = new Date(year, 4, 1);
  const mayfirstDay = mayFirst.getDay();
  
  // If May 1 is close to a weekend, create a long weekend
  if (mayfirstDay === 1 || mayfirstDay === 2 || mayfirstDay === 4 || mayfirstDay === 5) {
    const mayFirstStart = mayfirstDay === 1 ? addDays(mayFirst, -3) : mayfirstDay === 2 ? addDays(mayFirst, -4) : mayFirst;
    const mayFirstEnd = mayfirstDay === 4 ? addDays(mayFirst, 3) : mayfirstDay === 5 ? addDays(mayFirst, 2) : mayFirst;
    
    // Count vacation days needed
    let vacationDaysNeeded = 0;
    const currentDay = new Date(mayFirstStart);
    while (currentDay <= mayFirstEnd) {
      if (!isDayOff(currentDay, holidays)) {
        vacationDaysNeeded++;
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    const mayPeriod = {
      start: mayFirstStart,
      end: mayFirstEnd,
      days: differenceInDays(mayFirstEnd, mayFirstStart) + 1,
      vacationDaysNeeded: vacationDaysNeeded,
      description: "Första maj-helg",
      score: 70,
      type: "bridge"
    };
    
    periods.push(mayPeriod);
  }
  
  // National Day (June 6)
  const nationalDay = new Date(year, 5, 6);
  const nationalDayOfWeek = nationalDay.getDay();
  
  // If National Day is close to a weekend, create a long weekend
  if (nationalDayOfWeek === 1 || nationalDayOfWeek === 2 || nationalDayOfWeek === 4 || nationalDayOfWeek === 5) {
    const nationalDayStart = nationalDayOfWeek === 1 ? addDays(nationalDay, -3) : nationalDayOfWeek === 2 ? addDays(nationalDay, -4) : nationalDay;
    const nationalDayEnd = nationalDayOfWeek === 4 ? addDays(nationalDay, 3) : nationalDayOfWeek === 5 ? addDays(nationalDay, 2) : nationalDay;
    
    // Count vacation days needed
    let vacationDaysNeeded = 0;
    const currentDay = new Date(nationalDayStart);
    while (currentDay <= nationalDayEnd) {
      if (!isDayOff(currentDay, holidays)) {
        vacationDaysNeeded++;
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    const nationalDayPeriod = {
      start: nationalDayStart,
      end: nationalDayEnd,
      days: differenceInDays(nationalDayEnd, nationalDayStart) + 1,
      vacationDaysNeeded: vacationDaysNeeded,
      description: "Nationaldagshelg",
      score: 68,
      type: "bridge"
    };
    
    periods.push(nationalDayPeriod);
  }
  
  // All Saints' Day (first Saturday in November)
  const allSaintsMonth = 10; // November
  let allSaintsDay = new Date(year, allSaintsMonth, 1);
  while (allSaintsDay.getDay() !== 6) { // 6 is Saturday
    allSaintsDay = addDays(allSaintsDay, 1);
  }
  
  // Create a long weekend around All Saints' Day
  const allSaintsStart = addDays(allSaintsDay, -2); // Thursday
  const allSaintsEnd = addDays(allSaintsDay, 1); // Sunday
  
  // Count vacation days needed
  let allSaintsVacationDays = 0;
  const allSaintsCurrentDay = new Date(allSaintsStart);
  while (allSaintsCurrentDay <= allSaintsEnd) {
    if (!isDayOff(allSaintsCurrentDay, holidays)) {
      allSaintsVacationDays++;
    }
    allSaintsCurrentDay.setDate(allSaintsCurrentDay.getDate() + 1);
  }
  
  const allSaintsPeriod = {
    start: allSaintsStart,
    end: allSaintsEnd,
    days: differenceInDays(allSaintsEnd, allSaintsStart) + 1,
    vacationDaysNeeded: allSaintsVacationDays,
    description: "Alla helgons helg",
    score: 73,
    type: "bridge"
  };
  
  periods.push(allSaintsPeriod);
  
  // Find "bridge days" throughout the year
  const allDates = [];
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getMonth() === month) { // Skip invalid dates
        allDates.push(date);
      }
    }
  }
  
  // Find isolated workdays between holidays/weekends
  for (let i = 0; i < allDates.length; i++) {
    const today = allDates[i];
    const yesterday = i > 0 ? allDates[i-1] : null;
    const tomorrow = i < allDates.length - 1 ? allDates[i+1] : null;
    
    // Skip weekends and holidays
    if (isDayOff(today, holidays)) continue;
    
    // If both yesterday and tomorrow are days off, today is a "bridge day"
    if (yesterday && tomorrow && 
        isDayOff(yesterday, holidays) && 
        isDayOff(tomorrow, holidays)) {
        
      const bridgePeriod = {
        start: today,
        end: today,
        days: 1,
        vacationDaysNeeded: 1,
        description: "Klämdag",
        score: 85, // High score for efficiency
        type: "bridge"
      };
      
      periods.push(bridgePeriod);
    }
    
    // Find cases where taking 1 day creates a 4-day weekend
    if (today.getDay() === 2 && yesterday && isDayOff(yesterday, holidays)) {
      // Tuesday after a holiday Monday
      const bridgePeriod = {
        start: today,
        end: today,
        days: 1,
        vacationDaysNeeded: 1,
        description: "Förlängd helg",
        score: 75,
        type: "bridge"
      };
      
      periods.push(bridgePeriod);
    }
    
    if (today.getDay() === 4 && tomorrow && isDayOff(tomorrow, holidays)) {
      // Thursday before a holiday Friday
      const bridgePeriod = {
        start: today,
        end: today,
        days: 1,
        vacationDaysNeeded: 1,
        description: "Förlängd helg",
        score: 75,
        type: "bridge"
      };
      
      periods.push(bridgePeriod);
    }
  }
  
  return periods;
};
