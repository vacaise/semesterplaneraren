
// Denna fil innehåller logik för att optimera semesterplaneringen

import { addDays, isWeekend, isSameDay, differenceInDays, format, isWithinInterval } from "date-fns";

// Funktionen tar emot antal semesterdagar, helgdagar och önskat optimeringsläge
export const optimizeVacation = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
) => {
  // Identifiera potentiella perioder baserat på helgdagar och helger
  
  // Skapa en lista på alla dagar i året
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const allDays = [];
  
  // Fyll på med alla dagar i kalenderåret
  let currentDay = startDate;
  while (currentDay <= endDate) {
    allDays.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }
  
  // Hitta potentiella perioder baserat på helger och helgdagar
  const potentialPeriods = [];
  
  // Identifiera viktiga högtidsperioder (påsk, midsommar, jul, nyår)
  const keyPeriods = findKeyPeriods(year, holidays);
  potentialPeriods.push(...keyPeriods);
  
  // Hitta klämdagar (vardagar mellan helgdagar/helger)
  const bridgeDays = findBridgeDays(year, holidays);
  potentialPeriods.push(...bridgeDays);
  
  // Hitta långhelger runt vanliga helger
  const weekendPeriods = findExtendedWeekends(year, holidays);
  potentialPeriods.push(...weekendPeriods);
  
  // Sortera perioder efter prioritet baserat på valt läge
  potentialPeriods.sort((a, b) => {
    // Sortera efter poäng, högre poäng först
    return b.score - a.score;
  });
  
  // Optimera fördelningen av semesterdagar baserat på läge
  const selectedPeriods = [];
  let remainingVacationDays = vacationDays;
  
  // Fördela semesterdagar enligt valt läge
  // Olika strategier beroende på läge
  let periodIndex = 0;
  
  // Fortsätt lägga till perioder tills alla semesterdagar är fördelade
  while (remainingVacationDays > 0 && periodIndex < potentialPeriods.length) {
    const currentPeriod = potentialPeriods[periodIndex];
    
    // Kontrollera om vi har tillräckligt med dagar kvar
    if (currentPeriod.vacationDaysNeeded <= remainingVacationDays) {
      selectedPeriods.push(currentPeriod);
      remainingVacationDays -= currentPeriod.vacationDaysNeeded;
    }
    
    periodIndex++;
  }
  
  // Om vi fortfarande har dagar kvar, lägg till extra dagar till befintliga perioder
  // eller skapa nya korta perioder
  if (remainingVacationDays > 0) {
    // Skapa nya korta perioder för återstående dagar
    const extraPeriods = createExtraPeriods(year, remainingVacationDays, selectedPeriods, holidays);
    selectedPeriods.push(...extraPeriods);
    remainingVacationDays = 0;
  }
  
  // Räkna den totala ledigheten (semesterdagar + röda dagar + helger)
  let totalDaysOff = 0;
  selectedPeriods.forEach(period => {
    totalDaysOff += differenceInDays(period.end, period.start) + 1;
  });
  
  return {
    totalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: selectedPeriods
  };
};

// Hitta viktiga högtidsperioder
function findKeyPeriods(year, holidays) {
  const periods = [];
  
  // Påsk (uppskatta påskhelgen)
  const easterPeriod = {
    start: new Date(year, 3, 1),  // Uppskattning, exakt datum varierar
    end: new Date(year, 3, 6),
    days: 6,
    vacationDaysNeeded: 3,
    description: "Påskledighet",
    score: 80,  // Hög poäng för viktiga högtider
    type: "holiday"
  };
  
  // Midsommar
  const midsummerPeriod = {
    start: new Date(year, 5, 20),
    end: new Date(year, 5, 30),
    days: 11,
    vacationDaysNeeded: 7,
    description: "Midsommarledighet",
    score: 85,
    type: "holiday"
  };
  
  // Jul och nyår
  const christmasPeriod = {
    start: new Date(year, 11, 22),
    end: new Date(year, 11, 31),
    days: 10,
    vacationDaysNeeded: 5,
    description: "Julledighet",
    score: 90,  // Högsta poäng för jul/nyår
    type: "holiday"
  };
  
  periods.push(easterPeriod, midsummerPeriod, christmasPeriod);
  return periods;
}

// Hitta klämdagar mellan helgdagar och helger
function findBridgeDays(year, holidays) {
  const periods = [];
  
  // Exempel på "klämdagsperiod"
  const bridgePeriod = {
    start: new Date(year, 4, 1),  // Första maj
    end: new Date(year, 4, 5),
    days: 5,
    vacationDaysNeeded: 2,
    description: "Klämdagar kring första maj",
    score: 70,
    type: "bridge"
  };
  
  periods.push(bridgePeriod);
  return periods;
}

// Hitta långhelger runt vanliga helger
function findExtendedWeekends(year, holidays) {
  const periods = [];
  
  // Exempel på långhelger
  const extendedWeekend1 = {
    start: new Date(year, 9, 29),  // Fredag
    end: new Date(year, 10, 1),    // Söndag
    days: 4,
    vacationDaysNeeded: 1,
    description: "Långhelg i oktober",
    score: 60,
    type: "weekend"
  };
  
  const extendedWeekend2 = {
    start: new Date(year, 7, 10),  // Fredag
    end: new Date(year, 7, 13),    // Måndag
    days: 4,
    vacationDaysNeeded: 1,
    description: "Långhelg i augusti",
    score: 60,
    type: "weekend"
  };
  
  periods.push(extendedWeekend1, extendedWeekend2);
  return periods;
}

// Skapa extra perioder för återstående semesterdagar
function createExtraPeriods(year, remainingDays, selectedPeriods, holidays) {
  const extraPeriods = [];
  
  // Sommarperiod
  if (remainingDays >= 5) {
    const summerPeriod = {
      start: new Date(year, 6, 15),
      end: new Date(year, 6, 15 + remainingDays + 2),  // Lägg till helgdagar
      days: remainingDays + 2,
      vacationDaysNeeded: remainingDays,
      description: "Sommarsemester",
      score: 50,
      type: "summer"
    };
    extraPeriods.push(summerPeriod);
  } else {
    // Skapa en kort period med de resterande dagarna
    const shortPeriod = {
      start: new Date(year, 8, 10),
      end: new Date(year, 8, 10 + remainingDays),
      days: remainingDays,
      vacationDaysNeeded: remainingDays,
      description: "Kort ledighet",
      score: 40,
      type: "short"
    };
    extraPeriods.push(shortPeriod);
  }
  
  return extraPeriods;
}

// Denna funktion avgör om en given dag är en arbetsfri dag (helgdag eller helg)
export const isDayOff = (date: Date, holidays: Date[]) => {
  // Kontrollera om dagen är en helg (lördag eller söndag)
  if (isWeekend(date)) return true;
  
  // Kontrollera om dagen är en helgdag
  return holidays.some(holiday => isSameDay(holiday, date));
};
