
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
      score: 85, // Increased from 70
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
      score: 83, // Increased from 68
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
    score: 88, // Increased from 73
    type: "bridge"
  };
  
  periods.push(allSaintsPeriod);

  // Add specific bridge days for common red days throughout the year
  // These are days that can turn a single holiday into a long weekend with just 1 vacation day
  for (let month = 0; month < 12; month++) {
    // Try days throughout the month
    for (let day = 1; day <= 28; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      
      // Look for Tuesday or Thursday holidays - these are prime bridge day candidates
      if (dayOfWeek === 2 || dayOfWeek === 4) {
        // For Tuesday holidays, Monday is the bridge day
        if (dayOfWeek === 2) {
          const bridgeStart = addDays(currentDate, -3); // Saturday
          const bridgeEnd = currentDate; // Tuesday
          
          periods.push({
            start: bridgeStart,
            end: bridgeEnd,
            days: 4,
            vacationDaysNeeded: 1,
            description: `Bro dag ${month+1}/${day}`,
            score: 90, // Very high score for efficient 1-day bridge
            type: "bridge"
          });
        }
        
        // For Thursday holidays, Friday is the bridge day
        if (dayOfWeek === 4) {
          const bridgeStart = currentDate; // Thursday
          const bridgeEnd = addDays(currentDate, 3); // Sunday
          
          periods.push({
            start: bridgeStart,
            end: bridgeEnd,
            days: 4,
            vacationDaysNeeded: 1,
            description: `Bro dag ${month+1}/${day}`,
            score: 90, // Very high score for efficient 1-day bridge
            type: "bridge"
          });
        }
      }
    }
  }
  
  return periods;
};
