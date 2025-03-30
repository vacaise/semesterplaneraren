
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
  
  // Lägg till sommarsemester som en period
  const summerPeriods = findSummerPeriods(year);
  potentialPeriods.push(...summerPeriods);
  
  // Sortera perioder efter prioritet baserat på valt läge
  // Anpassa sortering baserat på olika modes
  potentialPeriods.sort((a, b) => {
    // Justera score baserat på valt läge
    let aScore = a.score;
    let bScore = b.score;
    
    if (mode === "longweekends" && a.days <= 4) aScore += 30;
    if (mode === "longweekends" && b.days <= 4) bScore += 30;
    
    if (mode === "minibreaks" && a.days <= 6 && a.days > 4) aScore += 30;
    if (mode === "minibreaks" && b.days <= 6 && b.days > 4) bScore += 30;
    
    if (mode === "weeks" && a.days <= 9 && a.days > 6) aScore += 30;
    if (mode === "weeks" && b.days <= 9 && b.days > 6) bScore += 30;
    
    if (mode === "extended" && a.days > 9) aScore += 30;
    if (mode === "extended" && b.days > 9) bScore += 30;
    
    // Sortera efter poäng, högre poäng först
    return bScore - aScore;
  });
  
  // Optimera fördelningen av semesterdagar
  const selectedPeriods = [];
  let remainingVacationDays = vacationDays;
  
  // Fördela semesterdagar enligt valt läge
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
    // Försök att förlänga befintliga perioder först
    let extraDaysApplied = extendExistingPeriods(selectedPeriods, remainingVacationDays);
    remainingVacationDays -= extraDaysApplied;
    
    // Om vi fortfarande har dagar kvar, skapa nya korta perioder
    if (remainingVacationDays > 0) {
      const extraPeriods = createExtraPeriods(year, remainingVacationDays, selectedPeriods, holidays);
      selectedPeriods.push(...extraPeriods);
      remainingVacationDays = 0;
    }
  }
  
  // Räkna den totala ledigheten (semesterdagar + röda dagar + helger)
  let totalDaysOff = 0;
  selectedPeriods.forEach(period => {
    totalDaysOff += differenceInDays(new Date(period.end), new Date(period.start)) + 1;
  });
  
  return {
    totalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: selectedPeriods
  };
};

// Försök att förlänga befintliga perioder med extra dagar
function extendExistingPeriods(selectedPeriods, extraDays) {
  let daysApplied = 0;
  
  // Prioritera kortare perioder för förlängning
  const periodsToExtend = [...selectedPeriods].sort((a, b) => a.days - b.days);
  
  for (let i = 0; i < periodsToExtend.length && daysApplied < extraDays; i++) {
    const period = periodsToExtend[i];
    
    // Lägg till en extra dag och öka vacationDaysNeeded
    if (daysApplied < extraDays) {
      period.end = addDays(new Date(period.end), 1);
      period.days += 1;
      period.vacationDaysNeeded += 1;
      daysApplied += 1;
    }
  }
  
  return daysApplied;
}

// Hitta viktiga högtidsperioder
function findKeyPeriods(year, holidays) {
  const periods = [];
  
  // Påsk (uppskatta påskhelgen)
  const easterPeriod = {
    start: new Date(year, 3, 1),  // Uppskattning, exakt datum varierar
    end: new Date(year, 3, 12),
    days: 12,
    vacationDaysNeeded: 8,
    description: "Påskledighet med klämdagar",
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
    start: new Date(year, 11, 20),
    end: new Date(year, 11, 31),
    days: 12,
    vacationDaysNeeded: 6,
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
  
  // Maj-klämdagar (Kristi himmelsfärd/första maj)
  const mayBridgePeriod = {
    start: new Date(year, 4, 1),  // Första maj
    end: new Date(year, 4, 12),
    days: 12,
    vacationDaysNeeded: 7,
    description: "Klämdagar kring Kristi himmelsfärd",
    score: 70,
    type: "bridge"
  };
  
  // November-klämdagar (Alla helgons dag)
  const novemberBridgePeriod = {
    start: new Date(year, 10, 1),
    end: new Date(year, 10, 5),
    days: 5,
    vacationDaysNeeded: 2,
    description: "Klämdagar kring Alla helgons dag",
    score: 65,
    type: "bridge"
  };
  
  periods.push(mayBridgePeriod, novemberBridgePeriod);
  return periods;
}

// Hitta långhelger runt vanliga helger
function findExtendedWeekends(year, holidays) {
  const periods = [];
  
  // Långhelger varje månad
  for (let month = 0; month < 12; month++) {
    // Skippa månader med stora högtider som redan har perioder
    if (month === 3 || month === 5 || month === 11) continue;
    
    const extendedWeekend = {
      start: new Date(year, month, 10),  // Mitten av månaden
      end: new Date(year, month, 14),
      days: 5,
      vacationDaysNeeded: 3,
      description: `Långhelg i ${getMonthName(month)}`,
      score: 60 - Math.abs(6 - month) * 2,  // Högre poäng för sommar/vinter
      type: "weekend"
    };
    
    periods.push(extendedWeekend);
  }
  
  return periods;
}

// Hitta sommarsemesterperioder
function findSummerPeriods(year) {
  const periods = [];
  
  // Juli semester (3 veckor)
  const julySummerPeriod = {
    start: new Date(year, 6, 1),
    end: new Date(year, 6, 21),
    days: 21,
    vacationDaysNeeded: 15,
    description: "Sommarsemester i juli",
    score: 75,
    type: "summer"
  };
  
  // Augusti semester (2 veckor)
  const augustSummerPeriod = {
    start: new Date(year, 7, 1),
    end: new Date(year, 7, 14),
    days: 14,
    vacationDaysNeeded: 10,
    description: "Sommarsemester i augusti",
    score: 73,
    type: "summer"
  };
  
  periods.push(julySummerPeriod, augustSummerPeriod);
  return periods;
}

// Skapa extra perioder för återstående semesterdagar
function createExtraPeriods(year, remainingDays, selectedPeriods, holidays) {
  const extraPeriods = [];
  
  // Beroende på antal dagar, skapa olika typer av perioder
  if (remainingDays >= 5) {
    // Skapa en sportlovs-period
    const winterPeriod = {
      start: new Date(year, 1, 15),
      end: new Date(year, 1, 15 + remainingDays + 2),  // Lägg till helgdagar
      days: remainingDays + 2,
      vacationDaysNeeded: remainingDays,
      description: "Sportlov",
      score: 50,
      type: "winter"
    };
    extraPeriods.push(winterPeriod);
  } else {
    // Skapa en kort period i oktober
    const shortPeriod = {
      start: new Date(year, 9, 10),
      end: new Date(year, 9, 10 + remainingDays),
      days: remainingDays,
      vacationDaysNeeded: remainingDays,
      description: "Kort höstledighet",
      score: 40,
      type: "short"
    };
    extraPeriods.push(shortPeriod);
  }
  
  return extraPeriods;
}

// Returnar månadens namn på svenska
function getMonthName(monthIndex) {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
}

// Denna funktion avgör om en given dag är en arbetsfri dag (helgdag eller helg)
export const isDayOff = (date: Date, holidays: Date[]) => {
  // Kontrollera om dagen är en helg (lördag eller söndag)
  if (isWeekend(date)) return true;
  
  // Kontrollera om dagen är en helgdag
  return holidays.some(holiday => isSameDay(holiday, date));
};
