
import { addDays, format, differenceInDays, isWeekend } from 'date-fns';
import { formatDateToString, isDayOff } from './helpers';
import { VacationPeriod } from './types';

// HELT NY IMPLEMENTATION: Beräknar faktiskt exakt alla unika lediga dagar över alla perioder
export const calculateTotalDaysOff = (periods: VacationPeriod[], holidays: Date[]) => {
  // Skapa en Set för att spåra unika dagar - viktigt för korrekt räkning
  const uniqueDaysOffSet = new Set<string>();
  
  console.log("BERÄKNAR TOTALT ANTAL LEDIGA DAGAR MED NY METOD");
  console.log(`Antal perioder att analysera: ${periods.length}`);
  
  // För varje period, lägg till alla dagar i Set:et
  periods.forEach((period, index) => {
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);
    
    console.log(`Period ${index+1}: ${format(startDate, 'yyyy-MM-dd')} till ${format(endDate, 'yyyy-MM-dd')}`);
    
    let currentDate = new Date(startDate);
    let periodDayCount = 0;
    
    while (currentDate <= endDate) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      
      // Lägg till datumet i set:et som garanterar unikhet
      uniqueDaysOffSet.add(dateString);
      periodDayCount++;
      
      // Gå till nästa dag
      currentDate = addDays(currentDate, 1);
    }
    
    console.log(`  Dagar i period ${index+1}: ${periodDayCount}`);
  });
  
  // Konvertera Set till Array för debugging
  const uniqueDaysArray = Array.from(uniqueDaysOffSet);
  console.log(`RESULTAT: ${uniqueDaysArray.length} UNIKA LEDIGA DAGAR TOTALT`);
  console.log("Dagar som räknats:", uniqueDaysArray.join(', '));
  
  return uniqueDaysArray.length;
};

// Beräknar antal semesterdagar som behövs för en period - spårar vilka datum som faktiskt används
export const calculateVacationDaysNeeded = (start: Date, end: Date, holidays: Date[]) => {
  let vacationDaysNeeded = 0;
  let currentDay = new Date(start);
  const usedDates: string[] = [];
  
  while (currentDay <= end) {
    const isHoliday = holidays.some(holiday => 
      format(holiday, 'yyyy-MM-dd') === format(currentDay, 'yyyy-MM-dd')
    );
    
    // Bara arbetsdagar (inte helger eller röda dagar) kräver semesterdagar
    if (!isWeekend(currentDay) && !isHoliday) {
      vacationDaysNeeded++;
      usedDates.push(format(currentDay, 'yyyy-MM-dd'));
    }
    
    currentDay = addDays(currentDay, 1);
  }
  
  console.log(`Semesterdagar som behövs: ${vacationDaysNeeded}`);
  console.log(`Datum som kräver semester: ${usedDates.join(', ')}`);
  
  return vacationDaysNeeded;
};

// Beräknar totalt antal dagar i en period
export const calculatePeriodDays = (start: Date, end: Date) => {
  return differenceInDays(end, start) + 1;
};

// Förbättrad beräkning av effektivitetskvot med korrekt avrundning
export const calculateEfficiencyRatio = (totalDaysOff: number, vacationDaysUsed: number) => {
  if (vacationDaysUsed <= 0) return 0;
  
  // Ger ett mer exakt värde med tre decimaler
  const ratio = totalDaysOff / vacationDaysUsed;
  console.log(`Exakt effektivitetskvot: ${ratio}`);
  
  // Avrunda till 2 decimaler för visning
  return Math.round(ratio * 100) / 100;
};
