
import { addDays, differenceInDays } from 'date-fns';
import { isDayOff } from '../helpers';
import { VacationPeriod } from '../types';

// Create extra periods for remaining vacation days
export const createExtraPeriods = (year: number, holidays: Date[], companyDays: Date[] = []): VacationPeriod[] => {
  const extraPeriods: VacationPeriod[] = [];
  
  // Find a good period for winter break (February)
  const sportBreakStart = new Date(year, 1, 15);
  let sportBreakStartDate = new Date(sportBreakStart);
  while (sportBreakStartDate.getDay() !== 1) { // Start on a Monday
    sportBreakStartDate = addDays(sportBreakStartDate, 1);
  }
  
  const sportBreakEnd = addDays(sportBreakStartDate, 6);
  
  // Calculate vacation days needed (excluding weekends and holidays)
  let sportBreakVacationDays = 0;
  const currentDay = new Date(sportBreakStartDate);
  
  while (currentDay <= sportBreakEnd) {
    if (!isDayOff(currentDay, holidays, companyDays)) {
      sportBreakVacationDays++;
    }
    currentDay.setDate(currentDay.getDate() + 1);
  }
  
  const winterPeriod = {
    start: sportBreakStartDate,
    end: sportBreakEnd,
    days: differenceInDays(sportBreakEnd, sportBreakStartDate) + 1,
    vacationDaysNeeded: sportBreakVacationDays,
    description: "Sportlov",
    score: 65,
    type: "winter"
  };
  
  // Create a fall break period (October)
  const fallBreakStart = new Date(year, 9, 28); // End of October
  let fallBreakStartDate = new Date(fallBreakStart);
  while (fallBreakStartDate.getDay() !== 1) { // Start on a Monday
    fallBreakStartDate = addDays(fallBreakStartDate, 1);
  }
  
  const fallBreakEnd = addDays(fallBreakStartDate, 4);
  
  // Calculate vacation days needed (excluding weekends and holidays)
  let fallBreakVacationDays = 0;
  const fallCurrentDay = new Date(fallBreakStartDate);
  
  while (fallCurrentDay <= fallBreakEnd) {
    if (!isDayOff(fallCurrentDay, holidays, companyDays)) {
      fallBreakVacationDays++;
    }
    fallCurrentDay.setDate(fallCurrentDay.getDate() + 1);
  }
  
  const fallPeriod = {
    start: fallBreakStartDate,
    end: fallBreakEnd,
    days: differenceInDays(fallBreakEnd, fallBreakStartDate) + 1,
    vacationDaysNeeded: fallBreakVacationDays,
    description: "Höstlov",
    score: 62,
    type: "fall"
  };
  
  // Create a spring break period (March/April)
  const springBreakStart = new Date(year, 2, 15);
  let springBreakStartDate = new Date(springBreakStart);
  while (springBreakStartDate.getDay() !== 1) { // Start on a Monday
    springBreakStartDate = addDays(springBreakStartDate, 1);
  }
  
  const springBreakEnd = addDays(springBreakStartDate, 6);
  
  // Calculate vacation days needed
  let springBreakVacationDays = 0;
  const springCurrentDay = new Date(springBreakStartDate);
  
  while (springCurrentDay <= springBreakEnd) {
    if (!isDayOff(springCurrentDay, holidays, companyDays)) {
      springBreakVacationDays++;
    }
    springCurrentDay.setDate(springCurrentDay.getDate() + 1);
  }
  
  const springPeriod = {
    start: springBreakStartDate,
    end: springBreakEnd,
    days: differenceInDays(springBreakEnd, springBreakStartDate) + 1,
    vacationDaysNeeded: springBreakVacationDays,
    description: "Vårlov",
    score: 67,
    type: "spring"
  };
  
  // Create November break
  const novemberBreakStart = new Date(year, 10, 10);
  let novemberBreakStartDate = new Date(novemberBreakStart);
  while (novemberBreakStartDate.getDay() !== 1) { // Start on a Monday
    novemberBreakStartDate = addDays(novemberBreakStartDate, 1);
  }
  
  const novemberBreakEnd = addDays(novemberBreakStartDate, 4);
  
  // Calculate vacation days needed
  let novemberBreakVacationDays = 0;
  const novemberCurrentDay = new Date(novemberBreakStartDate);
  
  while (novemberCurrentDay <= novemberBreakEnd) {
    if (!isDayOff(novemberCurrentDay, holidays, companyDays)) {
      novemberBreakVacationDays++;
    }
    novemberCurrentDay.setDate(novemberCurrentDay.getDate() + 1);
  }
  
  const novemberPeriod = {
    start: novemberBreakStartDate,
    end: novemberBreakEnd,
    days: differenceInDays(novemberBreakEnd, novemberBreakStartDate) + 1,
    vacationDaysNeeded: novemberBreakVacationDays,
    description: "Novemberledighet",
    score: 60,
    type: "fall"
  };
  
  extraPeriods.push(winterPeriod, fallPeriod, springPeriod, novemberPeriod);
  
  // Add some 3-day weekend extensions
  const months = [3, 5, 6, 8, 10];
  
  months.forEach(month => {
    // Friday-Sunday weekend extension
    const fridayDate = new Date(year, month - 1, 15);
    
    // Find the third Friday of the month
    let fridayCount = 0;
    while (fridayCount < 3) {
      if (fridayDate.getDay() === 5) {
        fridayCount++;
      }
      if (fridayCount < 3) {
        fridayDate.setDate(fridayDate.getDate() + 1);
      }
    }
    
    const fridayEnd = addDays(fridayDate, 2);
    
    // Calculate vacation days needed
    let fridayVacationDays = 0;
    const fridayCurrentDay = new Date(fridayDate);
    
    while (fridayCurrentDay <= fridayEnd) {
      if (!isDayOff(fridayCurrentDay, holidays, companyDays)) {
        fridayVacationDays++;
      }
      fridayCurrentDay.setDate(fridayCurrentDay.getDate() + 1);
    }
    
    if (fridayVacationDays > 0) {
      extraPeriods.push({
        start: fridayDate,
        end: fridayEnd,
        days: 3,
        vacationDaysNeeded: fridayVacationDays,
        description: `Helgförlängning ${getMonthName(month - 1)}`,
        score: 55,
        type: "weekend"
      });
    }
  });
  
  return extraPeriods;
};

// Helper function to get month name
const getMonthName = (monthIndex: number): string => {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
};
