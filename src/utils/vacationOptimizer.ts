
// Denna fil innehåller logik för att optimera semesterplaneringen

import { addDays, isWeekend, isSameDay, differenceInDays, format, isWithinInterval, getMonth, getDate, getYear, isBefore, isAfter } from "date-fns";

// Funktionen tar emot antal semesterdagar, helgdagar och önskat optimeringsläge
export const optimizeVacation = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
) => {
  // Skapa en lista på alla dagar i året
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  // Hitta viktiga datum för det specifika året
  const easterDate = calculateEaster(year);
  const midsummerDate = calculateMidsummer(year);
  
  // Hitta potentiella perioder baserat på valda optimeringsregler
  const potentialPeriods = [];
  
  // Identifiera viktiga högtidsperioder för det specifika året
  const keyPeriods = findKeyPeriods(year, holidays, easterDate, midsummerDate);
  potentialPeriods.push(...keyPeriods);
  
  // Hitta klämdagar för det specifika året
  const bridgeDays = findBridgeDays(year, holidays);
  potentialPeriods.push(...bridgeDays);
  
  // Hitta långhelger runt vanliga helger
  const weekendPeriods = findExtendedWeekends(year, holidays);
  potentialPeriods.push(...weekendPeriods);
  
  // Lägg till sommarsemester som en period
  const summerPeriods = findSummerPeriods(year);
  potentialPeriods.push(...summerPeriods);
  
  // Sortera perioder efter prioritet baserat på valt läge
  potentialPeriods.sort((a, b) => {
    let aScore = a.score;
    let bScore = b.score;
    
    // Justera poäng baserat på optimeringsläge
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
  
  // Första passet: prioritera högt värderade perioder
  for (const period of potentialPeriods) {
    // Kontrollera om perioden har högt värde (är en viktig högtidsperiod)
    if (period.score >= 75 && period.vacationDaysNeeded <= remainingVacationDays) {
      selectedPeriods.push(period);
      remainingVacationDays -= period.vacationDaysNeeded;
    }
    
    // Avbryt om alla semesterdagar är fördelade
    if (remainingVacationDays <= 0) break;
  }
  
  // Andra passet: lägg till perioder baserat på optimeringsläge
  if (remainingVacationDays > 0) {
    for (const period of potentialPeriods) {
      // Hoppa över redan valda perioder
      if (selectedPeriods.some(p => p === period)) continue;
      
      // Kontrollera om perioden passar optimeringsläget och om vi har tillräckligt med dagar
      let periodFitsMode = false;
      
      if (mode === "longweekends" && period.days <= 4) periodFitsMode = true;
      else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) periodFitsMode = true;
      else if (mode === "weeks" && period.days <= 9 && period.days > 6) periodFitsMode = true;
      else if (mode === "extended" && period.days > 9) periodFitsMode = true;
      else if (mode === "balanced") periodFitsMode = true;
      
      if (periodFitsMode && period.vacationDaysNeeded <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded;
      }
      
      // Avbryt om alla semesterdagar är fördelade
      if (remainingVacationDays <= 0) break;
    }
  }
  
  // Tredje passet: använd resterande dagar
  if (remainingVacationDays > 0) {
    // Välj mindre perioder eller små ledigheter
    for (const period of potentialPeriods) {
      // Hoppa över redan valda perioder
      if (selectedPeriods.some(p => p === period)) continue;
      
      // Om perioden passar inom återstående dagar
      if (period.vacationDaysNeeded <= remainingVacationDays) {
        selectedPeriods.push(period);
        remainingVacationDays -= period.vacationDaysNeeded;
      }
      
      // Avbryt om alla semesterdagar är fördelade
      if (remainingVacationDays <= 0) break;
    }
  }
  
  // Skapa extra små perioder om det finns dagar kvar
  if (remainingVacationDays > 0) {
    const extraPeriods = createExtraPeriods(year, remainingVacationDays, selectedPeriods, holidays);
    selectedPeriods.push(...extraPeriods);
  }
  
  // Räkna det totala antalet lediga dagar
  let totalDaysOff = calculateTotalDaysOff(selectedPeriods, holidays);
  
  // Kontrollera att inget är NaN
  if (isNaN(totalDaysOff)) {
    totalDaysOff = 0;
    console.error("totalDaysOff was NaN, setting to 0");
  }
  
  return {
    totalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: selectedPeriods
  };
};

// Beräknar det totala antalet lediga dagar
function calculateTotalDaysOff(periods, holidays) {
  let totalDays = 0;
  const allDaysOff = new Set(); // Använd Set för att undvika dubbelräkning
  
  // Lägg till alla dagar från alla perioder
  periods.forEach(period => {
    let currentDay = new Date(period.start);
    const periodEnd = new Date(period.end);
    
    while (currentDay <= periodEnd) {
      // Lägg till datum i formatet YYYY-MM-DD för att undvika dubbelräkning
      allDaysOff.add(format(currentDay, 'yyyy-MM-dd'));
      currentDay = addDays(currentDay, 1);
    }
  });
  
  return allDaysOff.size; // Returerar antalet unika dagar
}

// Beräknar påskdagen för ett givet år
function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-baserad månad
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month, day);
}

// Beräknar midsommardagen för ett givet år
function calculateMidsummer(year) {
  // Midsommarafton är alltid en fredag mellan 19 och 25 juni
  const june19 = new Date(year, 5, 19);
  const day = june19.getDay();
  const daysToAdd = day === 5 ? 0 : (5 - day + 7) % 7;
  return addDays(june19, daysToAdd);
}

// Hitta viktiga högtidsperioder
function findKeyPeriods(year, holidays, easterDate, midsummerDate) {
  const periods = [];
  
  // Påsk - dynamiskt beräknad baserat på det specifika året
  const easterThursday = addDays(easterDate, -3); // Skärtorsdag
  const easterMonday = addDays(easterDate, 1); // Annandag påsk
  const extendedEasterStart = addDays(easterThursday, -1); // Dagen före skärtorsdag
  const extendedEasterEnd = addDays(easterMonday, 3); // Några dagar efter påskhelgen
  
  const easterPeriod = {
    start: extendedEasterStart,
    end: extendedEasterEnd,
    days: differenceInDays(extendedEasterEnd, extendedEasterStart) + 1,
    vacationDaysNeeded: 7, // Anpassas baserat på röda dagar och helger
    description: "Påskledighet",
    score: 85,
    type: "holiday"
  };
  
  // Midsommar - dynamiskt beräknad baserat på det specifika året
  const midsummerStart = addDays(midsummerDate, -3); // Några dagar före midsommarafton
  const midsummerEnd = addDays(midsummerDate, 5); // Några dagar efter midsommarhelgen
  
  const midsummerPeriod = {
    start: midsummerStart,
    end: midsummerEnd,
    days: differenceInDays(midsummerEnd, midsummerStart) + 1,
    vacationDaysNeeded: 5,
    description: "Midsommarledighet",
    score: 80,
    type: "holiday"
  };
  
  // Jul och nyår
  const christmasStart = new Date(year, 11, 22);
  const newYearsEnd = new Date(year, 0, 7);
  
  const christmasPeriod = {
    start: christmasStart,
    end: new Date(year, 11, 31),
    days: differenceInDays(new Date(year, 11, 31), christmasStart) + 1,
    vacationDaysNeeded: 3,
    description: "Julledighet",
    score: 90,
    type: "holiday"
  };
  
  const newYearPeriod = {
    start: new Date(year, 0, 1),
    end: newYearsEnd,
    days: differenceInDays(newYearsEnd, new Date(year, 0, 1)) + 1,
    vacationDaysNeeded: 3,
    description: "Nyårsledighet",
    score: 85,
    type: "holiday"
  };
  
  // Kristi Himmelsfärd - 40 dagar efter påsk
  const ascensionDay = addDays(easterDate, 39);
  const ascensionStart = addDays(ascensionDay, -1);
  const ascensionEnd = addDays(ascensionDay, 3);
  
  const ascensionPeriod = {
    start: ascensionStart,
    end: ascensionEnd,
    days: differenceInDays(ascensionEnd, ascensionStart) + 1,
    vacationDaysNeeded: 1,
    description: "Kristi himmelsfärdshelg",
    score: 75,
    type: "bridge"
  };
  
  periods.push(easterPeriod, midsummerPeriod, christmasPeriod, newYearPeriod, ascensionPeriod);
  return periods;
}

// Hitta klämdagar mellan helgdagar och helger
function findBridgeDays(year, holidays) {
  const periods = [];
  
  // Valborg/Första maj
  const mayFirst = new Date(year, 4, 1);
  const mayfirstDay = mayFirst.getDay();
  
  // Om första maj är nära helgen, skapa en långhelg
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
  
  // Nationaldagen (6 juni)
  const nationalDay = new Date(year, 5, 6);
  const nationalDayOfWeek = nationalDay.getDay();
  
  // Om nationaldagen är nära helgen, skapa en långhelg
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
  
  // Alla helgons dag (första lördagen i november)
  const allSaintsMonth = 10; // November
  let allSaintsDay = new Date(year, allSaintsMonth, 1);
  while (allSaintsDay.getDay() !== 6) { // 6 är lördag
    allSaintsDay = addDays(allSaintsDay, 1);
  }
  
  // Skapa en långhelg runt Alla helgons dag
  const allSaintsStart = addDays(allSaintsDay, -2); // Torsdag
  const allSaintsEnd = addDays(allSaintsDay, 1); // Söndag
  
  const allSaintsPeriod = {
    start: allSaintsStart,
    end: allSaintsEnd,
    days: differenceInDays(allSaintsEnd, allSaintsStart) + 1,
    vacationDaysNeeded: 1, // Fredag
    description: "Alla helgons helg",
    score: 73,
    type: "bridge"
  };
  
  periods.push(allSaintsPeriod);
  
  return periods;
}

// Hitta långhelger runt vanliga helger
function findExtendedWeekends(year, holidays) {
  const periods = [];
  
  // Skapa långhelger för varje månad
  for (let month = 0; month < 12; month++) {
    // Skippa månader som redan har stora högtider
    if (month === 3 || month === 5 || month === 11 || month === 0) continue;
    
    // Leta efter bra helger att förlänga
    for (let weekNumber = 1; weekNumber <= 4; weekNumber++) {
      const baseDate = new Date(year, month, weekNumber * 7);
      
      // Hitta närmaste helg
      while (baseDate.getDay() !== 5) { // 5 är fredag
        baseDate.setDate(baseDate.getDate() + 1);
      }
      
      // Kontrollera att datumet fortfarande är i rätt månad
      if (baseDate.getMonth() !== month) continue;
      
      const weekendStart = addDays(baseDate, -1); // Torsdag
      const weekendEnd = addDays(baseDate, 3); // Måndag
      
      const extendedWeekend = {
        start: weekendStart,
        end: weekendEnd,
        days: differenceInDays(weekendEnd, weekendStart) + 1,
        vacationDaysNeeded: 2, // Torsdag, Fredag eller Måndag
        description: `Långhelg i ${getMonthName(month)}`,
        score: 60 - Math.abs(6 - month) * 2, // Högre poäng för sommar/vinter
        type: "weekend"
      };
      
      periods.push(extendedWeekend);
      
      // En långhelg per månad räcker
      break;
    }
  }
  
  return periods;
}

// Hitta sommarsemesterperioder
function findSummerPeriods(year) {
  const periods = [];
  
  // Juli-semester (3 veckor)
  const julyStart = new Date(year, 6, 1);
  const julyEnd = new Date(year, 6, 21);
  
  // Justera för att börja och sluta på en bra veckodag
  while (julyStart.getDay() !== 1) { // Starta på en måndag
    julyStart.setDate(julyStart.getDate() + 1);
  }
  
  while (julyEnd.getDay() !== 0) { // Sluta på en söndag
    julyEnd.setDate(julyEnd.getDate() + 1);
  }
  
  const julySummerPeriod = {
    start: julyStart,
    end: julyEnd,
    days: differenceInDays(julyEnd, julyStart) + 1,
    vacationDaysNeeded: 15,
    description: "Sommarsemester i juli",
    score: 82,
    type: "summer"
  };
  
  // Augusti-semester (2 veckor)
  const augustStart = new Date(year, 7, 1);
  const augustEnd = new Date(year, 7, 14);
  
  // Justera för att börja och sluta på en bra veckodag
  while (augustStart.getDay() !== 1) { // Starta på en måndag
    augustStart.setDate(augustStart.getDate() + 1);
  }
  
  while (augustEnd.getDay() !== 0) { // Sluta på en söndag
    augustEnd.setDate(augustEnd.getDate() + 1);
  }
  
  const augustSummerPeriod = {
    start: augustStart,
    end: augustEnd,
    days: differenceInDays(augustEnd, augustStart) + 1,
    vacationDaysNeeded: 10,
    description: "Sommarsemester i augusti",
    score: 78,
    type: "summer"
  };
  
  periods.push(julySummerPeriod, augustSummerPeriod);
  return periods;
}

// Skapa extra perioder för återstående semesterdagar
function createExtraPeriods(year, remainingDays, selectedPeriods, holidays) {
  const extraPeriods = [];
  
  // Hitta en bra period för sportlov (februari)
  const sportBreakStart = new Date(year, 1, 15);
  while (sportBreakStart.getDay() !== 1) { // Börja på en måndag
    sportBreakStart.setDate(sportBreakStart.getDate() + 1);
  }
  
  const sportBreakEnd = addDays(sportBreakStart, remainingDays >= 5 ? 6 : remainingDays - 1);
  
  const winterPeriod = {
    start: sportBreakStart,
    end: sportBreakEnd,
    days: differenceInDays(sportBreakEnd, sportBreakStart) + 1,
    vacationDaysNeeded: Math.min(5, remainingDays),
    description: "Sportlov",
    score: 65,
    type: "winter"
  };
  
  // Skapa en höstlovsperiod
  const fallBreakStart = new Date(year, 9, 28); // Slutet av oktober
  while (fallBreakStart.getDay() !== 1) { // Börja på en måndag
    fallBreakStart.setDate(fallBreakStart.getDate() + 1);
  }
  
  const fallBreakEnd = addDays(fallBreakStart, Math.min(4, remainingDays));
  
  const fallPeriod = {
    start: fallBreakStart,
    end: fallBreakEnd,
    days: differenceInDays(fallBreakEnd, fallBreakStart) + 1,
    vacationDaysNeeded: Math.min(5, remainingDays),
    description: "Höstlov",
    score: 62,
    type: "fall"
  };
  
  // Lägg till den lämpligaste perioden baserat på antal återstående dagar
  if (remainingDays >= 5) {
    extraPeriods.push(winterPeriod);
  } else {
    extraPeriods.push(fallPeriod);
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
