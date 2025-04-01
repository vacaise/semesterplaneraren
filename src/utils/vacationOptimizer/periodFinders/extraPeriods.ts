
import { addDays, differenceInDays } from 'date-fns';

// Create extra periods for remaining vacation days
export const createExtraPeriods = () => {
  const year = new Date().getFullYear();
  const extraPeriods = [];
  
  // Find a good period for winter break (February)
  const sportBreakStart = new Date(year, 1, 15);
  let sportBreakStartDate = new Date(sportBreakStart);
  while (sportBreakStartDate.getDay() !== 1) { // Start on a Monday
    sportBreakStartDate = addDays(sportBreakStartDate, 1);
  }
  
  const sportBreakEnd = addDays(sportBreakStartDate, 6);
  
  const winterPeriod = {
    start: sportBreakStartDate,
    end: sportBreakEnd,
    days: differenceInDays(sportBreakEnd, sportBreakStartDate) + 1,
    vacationDaysNeeded: 5,
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
  
  const fallBreakEnd = addDays(fallBreakStartDate, 4);
  
  const fallPeriod = {
    start: fallBreakStartDate,
    end: fallBreakEnd,
    days: differenceInDays(fallBreakEnd, fallBreakStartDate) + 1,
    vacationDaysNeeded: 5,
    description: "Höstlov",
    score: 62,
    type: "fall"
  };
  
  extraPeriods.push(winterPeriod, fallPeriod);
  return extraPeriods;
};
