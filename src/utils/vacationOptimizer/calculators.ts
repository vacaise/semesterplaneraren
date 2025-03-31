
import { addDays, format, differenceInDays } from 'date-fns';
import { formatDateToString, isDayOff } from './helpers';
import { VacationPeriod } from './types';

// Helt ny implementering för att beräkna det totala antalet lediga dagar
export const calculateTotalDaysOff = (periods: VacationPeriod[], holidays: Date[]) => {
  // Skapa en uppsättning för att spåra alla unika dagar
  const uniqueDaysSet = new Set<string>();
  
  // Gå igenom varje period och lägg till alla dagar i uppsättningen
  periods.forEach(period => {
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Formatera datumet som en sträng för att säkerställa unikhet i uppsättningen
      const dateString = format(currentDate, 'yyyy-MM-dd');
      uniqueDaysSet.add(dateString);
      
      // Gå till nästa dag
      currentDate = addDays(currentDate, 1);
    }
  });
  
  // Antal unika dagar är storleken på uppsättningen
  return uniqueDaysSet.size;
};

// Beräkna antal semesterdagar som behövs för en period
export const calculateVacationDaysNeeded = (start: Date, end: Date, holidays: Date[]) => {
  let vacationDaysNeeded = 0;
  let currentDay = new Date(start);
  
  while (currentDay <= end) {
    const dayOfWeek = currentDay.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Söndag eller lördag
    const isHoliday = holidays.some(holiday => 
      format(holiday, 'yyyy-MM-dd') === format(currentDay, 'yyyy-MM-dd')
    );
    
    // Lägg bara till arbetsdagar (inte helger eller röda dagar)
    if (!isWeekend && !isHoliday) {
      vacationDaysNeeded++;
    }
    
    currentDay = addDays(currentDay, 1);
  }
  
  return vacationDaysNeeded;
};

// Beräkna totalt antal dagar i en period
export const calculatePeriodDays = (start: Date, end: Date) => {
  return differenceInDays(end, start) + 1;
};

// Ny beräkning för effektivitetskvot
export const calculateEfficiencyRatio = (totalDaysOff: number, vacationDaysUsed: number) => {
  if (vacationDaysUsed <= 0) return 0;
  return parseFloat((totalDaysOff / vacationDaysUsed).toFixed(2));
};
