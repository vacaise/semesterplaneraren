
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
  console.log("--------------------------------");
  console.log("STARTING VACATION OPTIMIZATION");
  console.log("--------------------------------");
  console.log(`Year: ${year}, Vacation Days: ${vacationDays}, Mode: ${mode}`);
  console.log(`Holidays: ${holidays.length}`);
  
  // Filtrera bort helgdagar som redan har passerat
  const filteredHolidays = holidays.filter(holiday => !isDateInPast(holiday));
  console.log(`After filtering past dates: ${filteredHolidays.length} holidays remain`);
  
  // Hitta optimala perioder baserat på parametrarna
  const { periods: selectedPeriods } = findOptimalSchedule(year, vacationDays, filteredHolidays, mode);
  console.log(`Optimal schedule found: ${selectedPeriods.length} periods`);
  
  // Verifiera att perioder inte innehåller några passerade datum
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const validatedPeriods = selectedPeriods.filter(period => {
    const endDate = new Date(period.end);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  });
  console.log(`After filtering past periods: ${validatedPeriods.length} periods remain`);
  
  // Beräkna totalt antal lediga dagar
  const totalDaysOff = calculateTotalDaysOff(validatedPeriods, filteredHolidays);
  
  // Beräkna effektivitetskvot
  const efficiencyRatio = calculateEfficiencyRatio(totalDaysOff, vacationDays);
  
  console.log("--------------------------------");
  console.log("OPTIMIZATION RESULTS");
  console.log("--------------------------------");
  console.log("TOTAL ANTAL LEDIGA DAGAR:", totalDaysOff);
  console.log("ANVÄNDA SEMESTERDAGAR:", vacationDays);
  console.log("EFFEKTIVITETSKVOT:", efficiencyRatio);
  console.log("--------------------------------");
  
  return {
    totalDaysOff,
    vacationDaysUsed: vacationDays,
    mode,
    periods: validatedPeriods
  };
};

export { isDayOff, isDateInPast };
export type { VacationPeriod };
