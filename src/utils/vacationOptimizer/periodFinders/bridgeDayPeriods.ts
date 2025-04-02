
import { addDays, differenceInDays } from 'date-fns';

// Find bridge days between holidays and weekends
export const findBridgeDays = (year: number) => {
  const periods = [];
  
  // May Day (May 1)
  const mayFirst = new Date(year, 4, 1);
  const mayfirstDay = mayFirst.getDay();
  
  // If May 1 is close to a weekend, create a long weekend
  if (mayfirstDay === 1 || mayfirstDay === 2 || mayfirstDay === 4 || mayfirstDay === 5) {
    const mayFirstStart = mayfirstDay === 1 ? addDays(mayFirst, -3) : mayfirstDay === 2 ? addDays(mayFirst, -4) : mayFirst;
    const mayFirstEnd = mayfirstDay === 4 ? addDays(mayFirst, 3) : mayfirstDay === 5 ? addDays(mayFirst, 2) : mayFirst;
    
    const mayPeriod = {
      start: mayFirstStart,
      end: mayFirstEnd,
      days: differenceInDays(mayFirstEnd, mayFirstStart) + 1,
      vacationDaysNeeded: mayfirstDay === 1 ? 1 : mayfirstDay === 2 ? 1 : mayfirstDay === 4 ? 1 : mayfirstDay === 5 ? 1 : 0,
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
    
    const nationalDayPeriod = {
      start: nationalDayStart,
      end: nationalDayEnd,
      days: differenceInDays(nationalDayEnd, nationalDayStart) + 1,
      vacationDaysNeeded: nationalDayOfWeek === 1 ? 1 : nationalDayOfWeek === 2 ? 1 : nationalDayOfWeek === 4 ? 1 : nationalDayOfWeek === 5 ? 1 : 0,
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
  
  const allSaintsPeriod = {
    start: allSaintsStart,
    end: allSaintsEnd,
    days: differenceInDays(allSaintsEnd, allSaintsStart) + 1,
    vacationDaysNeeded: 1, // Friday
    description: "Alla helgons helg",
    score: 73,
    type: "bridge"
  };
  
  periods.push(allSaintsPeriod);
  
  return periods;
};
