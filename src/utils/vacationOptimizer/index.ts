
// Huvudingångspunkt för semesteroptimeraren
import { findOptimalSchedule } from './optimizer';
import { calculateTotalDaysOff, calculateEfficiencyRatio } from './calculators';
import { isDayOff, isDateInPast } from './helpers';
import { VacationPeriod } from './types';

interface OptimizedSchedule {
  totalDaysOff: number;
  vacationDaysUsed: number;
  mode: string;
  periods: VacationPeriod[];
}

// Huvudexportfunktion för att optimera semester
export const optimizeVacation = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): OptimizedSchedule => {
  // Filtrera bort helgdagar som redan har passerat
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  
  // Hitta potentiella perioder baserat på parametrarna
  const { periods: selectedPeriods } = findOptimalSchedule(year, vacationDays, filteredHolidays, mode);
  
  // Verifiera att perioder inte innehåller några passerade datum
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const validatedPeriods = selectedPeriods.filter(period => {
    const endDate = new Date(period.end);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  });

  // Beräkna faktiskt totalt antal lediga dagar från alla perioder kombinerade
  const actualTotalDaysOff = calculateTotalDaysOff(validatedPeriods, filteredHolidays);
  
  // Beräkna effektivitetskvot
  const efficiencyRatio = calculateEfficiencyRatio(actualTotalDaysOff, vacationDays);
  
  // Visa beräkningarna i konsolen för felsökning
  console.log("TOTALT ANTAL UNIKA LEDIGA DAGAR:", actualTotalDaysOff);
  console.log("ANVÄNDA SEMESTERDAGAR:", vacationDays);
  console.log("EFFEKTIVITETSKVOT:", efficiencyRatio);
  
  return {
    totalDaysOff: actualTotalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
