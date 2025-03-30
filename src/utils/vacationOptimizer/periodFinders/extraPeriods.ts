
import { addDays, differenceInDays } from 'date-fns';

// Create extra periods for remaining vacation days
export const createExtraPeriods = (year: number, remainingDays: number) => {
  const extraPeriods = [];
  
  // Find a good period for winter break (February)
  const sportBreakStart = new Date(year, 1, 15);
  let sportBreakStartDate = new Date(sportBreakStart);
  while (sportBreakStartDate.getDay() !== 1) { // Start on a Monday
    sportBreakStartDate = addDays(sportBreakStartDate, 1);
  }
  
  const sportBreakEnd = addDays(sportBreakStartDate, remainingDays >= 5 ? 6 : remainingDays - 1);
  
  const winterPeriod = {
    start: sportBreakStartDate,
    end: sportBreakEnd,
    days: differenceInDays(sportBreakEnd, sportBreakStartDate) + 1,
    vacationDaysNeeded: Math.min(5, remainingDays),
    description: "Sportlov",
    score: 65,
    type: "winter"
  };
  
  // Create a fall break period
  const fallBreakStart = new Date(year, 9, 28); // End of October
  let fallBreakStartDate = new Date(fallBreakStart);
  while (fallBreakStartDate.getDay() !== 1) { // Start on a Monday
    fallBreakStartDate = addDays(fallBreakStartDate, 1);
  }
  
  const fallBreakEnd = addDays(fallBreakStartDate, Math.min(4, remainingDays));
  
  const fallPeriod = {
    start: fallBreakStartDate,
    end: fallBreakEnd,
    days: differenceInDays(fallBreakEnd, fallBreakStartDate) + 1,
    vacationDaysNeeded: Math.min(5, remainingDays),
    description: "Höstlov",
    score: 62,
    type: "fall"
  };
  
  // Add the most suitable period based on remaining days
  if (remainingDays >= 5) {
    extraPeriods.push(winterPeriod);
  } else {
    extraPeriods.push(fallPeriod);
  }
  
  return extraPeriods;
};
