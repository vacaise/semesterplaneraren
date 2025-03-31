
import { addDays, format, differenceInDays, isWeekend } from 'date-fns';
import { formatDateToString, isDayOff } from './helpers';
import { VacationPeriod } from './types';

// Calculates total days off across all periods - only counting days within periods
export const calculateTotalDaysOff = (periods: VacationPeriod[], holidays: Date[]) => {
  let totalDaysOff = 0;
  
  // For each period, add the total days
  // This correctly counts only days within the selected periods
  periods.forEach(period => {
    totalDaysOff += period.days;
  });
  
  return totalDaysOff;
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
  
  return vacationDaysNeeded;
};

// Beräknar totalt antal dagar i en period
export const calculatePeriodDays = (start: Date, end: Date) => {
  return differenceInDays(end, start) + 1;
};

// Beräknar effektivitetskvot
export const calculateEfficiencyRatio = (totalDaysOff: number, vacationDaysUsed: number) => {
  if (vacationDaysUsed <= 0) return 0;
  
  const ratio = totalDaysOff / vacationDaysUsed;
  
  // Avrunda till 2 decimaler för visning
  return Math.round(ratio * 100) / 100;
};
