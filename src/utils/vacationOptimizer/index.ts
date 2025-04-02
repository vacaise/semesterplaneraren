
import { VacationPeriod } from './types';
import { isDayOff, isDateInPast, formatDateRange } from './helpers';

interface OptimizedSchedule {
  totalDaysOff: number;
  vacationDaysUsed: number;
  mode: string;
  periods: VacationPeriod[];
}

/**
 * Huvudfunktion för att optimera semesterdagar
 */
export const optimizeVacation = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): OptimizedSchedule => {
  // Filtrera bort helgdagar som redan har passerat
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Generera alla möjliga perioder baserat på parametrarna
  const periods = generateOptimalPeriods(year, vacationDays, filteredHolidays, mode);
  
  // Beräkna totala lediga dagar (detta inkluderar helger och helgdagar inom perioderna)
  const totalDaysOff = calculateTotalDaysOff(periods);
  
  return {
    totalDaysOff,
    vacationDaysUsed: vacationDays, // Använd exakt det antal dagar som angetts
    mode,
    periods
  };
};

/**
 * Generera optimala ledighetsperioder baserat på angivet läge och antal semesterdagar
 */
const generateOptimalPeriods = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): VacationPeriod[] => {
  // Skapa alla möjliga ledighetsperioder för året
  const allPossiblePeriods = generatePossiblePeriods(year, holidays);
  
  // Poängsätt perioder baserat på valt läge
  const scoredPeriods = scorePeriodsForMode(allPossiblePeriods, mode);
  
  // Välj optimala perioder upp till det angivna antalet semesterdagar
  return selectOptimalPeriods(scoredPeriods, vacationDays, holidays);
};

/**
 * Generera alla möjliga ledighetsperioder runt helgdagar och helger
 */
const generatePossiblePeriods = (
  year: number,
  holidays: Date[]
): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Lägg till strategiska klämdag-perioder
  periods.push(...findBridgeDays(year, holidays));
  
  // Lägg till långhelger
  periods.push(...findExtendedWeekends(year, holidays));
  
  // Lägg till veckosemestrar
  periods.push(...findWeekVacations(year, holidays));
  
  // Lägg till sommarsemestrar
  periods.push(...findSummerVacations(year, holidays));
  
  // Lägg till enstaka dagar som kompletterar andra perioder
  periods.push(...findSingleDays(year, holidays));
  
  // Filtrera bort perioder som är i det förflutna
  return periods.filter(period => {
    const endDate = new Date(period.end);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  });
};

/**
 * Hitta klämdagar mellan helgdagar och helger
 */
const findBridgeDays = (year: number, holidays: Date[]): VacationPeriod[] => {
  const bridgePeriods: VacationPeriod[] = [];
  const monthNames = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  
  // Gå igenom alla arbetsdagar i året
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      
      // Ignorera helger (0 = söndag, 6 = lördag)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      // Ignorera helgdagar
      if (holidays.some(h => isSameDay(h, currentDate))) continue;
      
      // Kontrollera om dagen är en klämdag
      const previousDay = new Date(currentDate);
      previousDay.setDate(previousDay.getDate() - 1);
      
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const isPreviousDayOff = isDayOff(previousDay, holidays);
      const isNextDayOff = isDayOff(nextDay, holidays);
      
      if (isPreviousDayOff && isNextDayOff) {
        // Detta är en klämdag mellan två lediga dagar
        bridgePeriods.push({
          start: currentDate,
          end: currentDate,
          days: 3, // Tre dagar ledigt totalt med de omgivande dagarna
          vacationDaysNeeded: 1,
          description: `Klämdag ${day} ${monthNames[month]}`,
          type: "bridge"
        });
      }
    }
  }
  
  return bridgePeriods;
};

/**
 * Hitta långhelger (torsdag-söndag eller fredag-måndag)
 */
const findExtendedWeekends = (year: number, holidays: Date[]): VacationPeriod[] => {
  const weekendPeriods: VacationPeriod[] = [];
  const monthNames = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  
  // Gå igenom alla månader
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Hitta torsdagar för torsdag-söndag långhelger
    for (let day = 1; day <= daysInMonth; day++) {
      const thursday = new Date(year, month, day);
      if (thursday.getDay() !== 4) continue; // Torsdag är 4
      
      const sunday = new Date(thursday);
      sunday.setDate(thursday.getDate() + 3); // Söndag är 3 dagar efter torsdag
      
      // Räkna hur många semesterdagar som behövs
      let vacationDaysNeeded = 0;
      let currentDay = new Date(thursday);
      
      while (currentDay <= sunday) {
        if (!isDayOff(currentDay, holidays)) {
          vacationDaysNeeded++;
        }
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      // Lägg bara till om minst en semesterdag behövs
      if (vacationDaysNeeded > 0) {
        weekendPeriods.push({
          start: thursday,
          end: sunday,
          days: 4,
          vacationDaysNeeded,
          description: `Långhelg ${day}-${day + 3} ${monthNames[month]}`,
          type: "weekend"
        });
      }
    }
    
    // Hitta fredagar för fredag-måndag långhelger
    for (let day = 1; day <= daysInMonth; day++) {
      const friday = new Date(year, month, day);
      if (friday.getDay() !== 5) continue; // Fredag är 5
      
      const monday = new Date(friday);
      monday.setDate(friday.getDate() + 3); // Måndag är 3 dagar efter fredag
      
      // Räkna hur många semesterdagar som behövs
      let vacationDaysNeeded = 0;
      let currentDay = new Date(friday);
      
      while (currentDay <= monday) {
        if (!isDayOff(currentDay, holidays)) {
          vacationDaysNeeded++;
        }
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      // Lägg bara till om minst en semesterdag behövs
      if (vacationDaysNeeded > 0) {
        weekendPeriods.push({
          start: friday,
          end: monday,
          days: 4,
          vacationDaysNeeded,
          description: `Långhelg ${day}-${day + 3} ${monthNames[month]}`,
          type: "weekend"
        });
      }
    }
  }
  
  return weekendPeriods;
};

/**
 * Hitta veckolånga semestrar (måndag-söndag)
 */
const findWeekVacations = (year: number, holidays: Date[]): VacationPeriod[] => {
  const weekPeriods: VacationPeriod[] = [];
  const monthNames = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  
  // Gå igenom alla månader
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Hitta måndagar för att starta veckor
    for (let day = 1; day <= daysInMonth; day++) {
      const monday = new Date(year, month, day);
      if (monday.getDay() !== 1) continue; // Måndag är 1
      
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6); // Söndag är 6 dagar efter måndag
      
      // Räkna hur många semesterdagar som behövs
      let vacationDaysNeeded = 0;
      let currentDay = new Date(monday);
      
      while (currentDay <= sunday) {
        if (!isDayOff(currentDay, holidays)) {
          vacationDaysNeeded++;
        }
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      weekPeriods.push({
        start: monday,
        end: sunday,
        days: 7,
        vacationDaysNeeded,
        description: `Vecka i ${monthNames[month]}`,
        type: "week"
      });
    }
  }
  
  return weekPeriods;
};

/**
 * Hitta sommarsemestrar (2-3 veckor under juni-augusti)
 */
const findSummerVacations = (year: number, holidays: Date[]): VacationPeriod[] => {
  const summerPeriods: VacationPeriod[] = [];
  
  // Sommarperioder med start på måndagar
  for (let month = 5; month <= 7; month++) { // Juni (5) till Augusti (7)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const startDate = new Date(year, month, day);
      if (startDate.getDay() !== 1) continue; // Börja bara på måndagar
      
      // 2-veckors semester
      const twoWeekEnd = new Date(startDate);
      twoWeekEnd.setDate(startDate.getDate() + 13); // 14 dagar (2 veckor)
      
      let vacationDaysNeededTwoWeek = 0;
      let currentDay = new Date(startDate);
      while (currentDay <= twoWeekEnd) {
        if (!isDayOff(currentDay, holidays)) {
          vacationDaysNeededTwoWeek++;
        }
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      summerPeriods.push({
        start: startDate,
        end: twoWeekEnd,
        days: 14,
        vacationDaysNeeded: vacationDaysNeededTwoWeek,
        description: `2 veckors sommarsemester`,
        type: "summer"
      });
      
      // 3-veckors semester
      const threeWeekEnd = new Date(startDate);
      threeWeekEnd.setDate(startDate.getDate() + 20); // 21 dagar (3 veckor)
      
      let vacationDaysNeededThreeWeek = 0;
      currentDay = new Date(startDate);
      while (currentDay <= threeWeekEnd) {
        if (!isDayOff(currentDay, holidays)) {
          vacationDaysNeededThreeWeek++;
        }
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      summerPeriods.push({
        start: startDate,
        end: threeWeekEnd,
        days: 21,
        vacationDaysNeeded: vacationDaysNeededThreeWeek,
        description: `3 veckors sommarsemester`,
        type: "summer"
      });
    }
  }
  
  return summerPeriods;
};

/**
 * Hitta enstaka dagar för att komplettera andra perioder
 */
const findSingleDays = (year: number, holidays: Date[]): VacationPeriod[] => {
  const singleDayPeriods: VacationPeriod[] = [];
  const monthNames = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  
  // Prioritera måndagar och fredagar
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      
      // Fokus på måndagar (1) och fredagar (5)
      if (dayOfWeek !== 1 && dayOfWeek !== 5) continue;
      
      // Ignorera helgdagar
      if (holidays.some(h => isSameDay(h, currentDate))) continue;
      
      singleDayPeriods.push({
        start: currentDate,
        end: currentDate,
        days: 1,
        vacationDaysNeeded: 1,
        description: `Extra dag ${day} ${monthNames[month]}`,
        type: "single"
      });
    }
  }
  
  // Lägg även till tisdagar, onsdagar och torsdagar
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      
      // Fokus på tisdagar (2), onsdagar (3) och torsdagar (4)
      if (dayOfWeek !== 2 && dayOfWeek !== 3 && dayOfWeek !== 4) continue;
      
      // Ignorera helgdagar
      if (holidays.some(h => isSameDay(h, currentDate))) continue;
      
      singleDayPeriods.push({
        start: currentDate,
        end: currentDate,
        days: 1,
        vacationDaysNeeded: 1,
        description: `Extra dag ${day} ${monthNames[month]}`,
        type: "single"
      });
    }
  }
  
  return singleDayPeriods;
};

/**
 * Poängsätt perioder baserat på valt läge
 */
const scorePeriodsForMode = (periods: VacationPeriod[], mode: string): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
  scoredPeriods.forEach(period => {
    // Grundpoäng baserat på effektivitet
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    period.score = Math.floor(efficiency * 10);
    
    // Lägesspecifik poängsättning
    switch (mode) {
      case "longweekends":
        // Prioritera långhelger (3-4 dagar)
        if (period.days <= 4) period.score += 40;
        break;
      case "minibreaks":
        // Prioritera miniledigheter (4-6 dagar)
        if (period.days > 4 && period.days <= 6) period.score += 40;
        break;
      case "weeks":
        // Prioritera veckolånga ledigheter (7-9 dagar)
        if (period.days >= 7 && period.days <= 9) period.score += 40;
        break;
      case "extended":
        // Prioritera längre ledigheter (10+ dagar)
        if (period.days >= 10) period.score += 40;
        break;
      case "balanced":
      default:
        // För balanserad, ge jämn poäng till alla periodlängder
        if (period.days <= 4) period.score += 20;
        else if (period.days <= 9) period.score += 25;
        else period.score += 30;
        break;
    }
    
    // Bonuspoäng för klämdagar
    if (period.type === "bridge") period.score += 15;
    
    // Bonuspoäng för sommarsemester i extended mode
    if (period.type === "summer" && mode === "extended") period.score += 20;
  });
  
  // Sortera efter poäng
  return scoredPeriods.sort((a, b) => (b.score || 0) - (a.score || 0));
};

/**
 * Välj optimala perioder för att exakt använda upp det angivna antalet semesterdagar
 */
const selectOptimalPeriods = (
  scoredPeriods: VacationPeriod[],
  vacationDays: number,
  holidays: Date[]
): VacationPeriod[] => {
  const selected: VacationPeriod[] = [];
  let remainingDays = vacationDays;
  
  // Första passet: välj perioder som inte överlappar och som passar inom våra dagar
  for (const period of scoredPeriods) {
    if (period.vacationDaysNeeded <= remainingDays) {
      // Kontrollera överlappning med redan valda perioder
      const hasOverlap = selected.some(selectedPeriod => {
        return datesOverlap(
          period.start, period.end,
          selectedPeriod.start, selectedPeriod.end
        );
      });
      
      if (!hasOverlap) {
        selected.push(period);
        remainingDays -= period.vacationDaysNeeded;
      }
      
      // Sluta om vi har använt alla semesterdagar
      if (remainingDays <= 0) break;
    }
  }
  
  // Om vi har dagar kvar, försök lägga till enstaka dagar
  if (remainingDays > 0) {
    // Skapa enstaka dagar för att fylla på
    const singleDays = findSingleDays(new Date().getFullYear(), holidays)
      .filter(day => !selected.some(period => datesOverlap(
        day.start, day.end, period.start, period.end
      )));
    
    // Lägg till enstaka dagar tills vi har använt upp alla semesterdagar
    for (const day of singleDays) {
      if (remainingDays <= 0) break;
      selected.push(day);
      remainingDays--;
    }
  }
  
  // Sortera efter datum (kronologiskt)
  return selected.sort((a, b) => a.start.getTime() - b.start.getTime());
};

/**
 * Beräkna totala lediga dagar från alla valda perioder
 */
const calculateTotalDaysOff = (periods: VacationPeriod[]): number => {
  return periods.reduce((total, period) => total + period.days, 0);
};

/**
 * Hjälpfunktion för att kontrollera om två datumintervall överlappar
 */
const datesOverlap = (
  startA: Date, 
  endA: Date, 
  startB: Date, 
  endB: Date
): boolean => {
  return (startA <= endB) && (endA >= startB);
};

/**
 * Hjälpfunktion för att kontrollera om två datum är samma dag
 */
const isSameDay = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

export { isDayOff, isDateInPast, formatDateRange };
export type { VacationPeriod };
