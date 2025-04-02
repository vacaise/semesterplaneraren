
import { addDays, differenceInDays, getDay } from 'date-fns';
import { VacationPeriod, OptimizationResult, isDayOff, calculateVacationDaysNeeded, calculateTotalDays, calculateEfficiency, doPeriodsOverlap } from './calculators';

// Generate periods based on optimization mode
export const optimizeVacation = (
  year: number,
  vacationDays: number,
  holidays: Date[],
  mode: string
): OptimizationResult => {
  // Generate all possible vacation periods
  let allPeriods = generateAllPossiblePeriods(year, holidays);
  
  // Score periods based on the selected mode
  allPeriods = scorePeriods(allPeriods, mode);
  
  // Select the best periods that use exactly the given number of vacation days
  const selectedPeriods = selectOptimalPeriods(allPeriods, vacationDays, holidays);
  
  // Calculate totals
  const totalDaysOff = selectedPeriods.reduce((sum, period) => sum + period.totalDays, 0);
  const vacationDaysUsed = selectedPeriods.reduce((sum, period) => sum + period.vacationDaysUsed, 0);
  
  // Calculate efficiency
  const efficiency = calculateEfficiency(totalDaysOff, vacationDaysUsed);
  
  return {
    periods: selectedPeriods,
    totalDaysOff,
    vacationDaysUsed,
    mode,
    efficiency
  };
};

// Generate all possible vacation periods for the year
const generateAllPossiblePeriods = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  
  // Add bridge days
  periods.push(...findBridgeDays(year, holidays));
  
  // Add long weekends
  periods.push(...findLongWeekends(year, holidays));
  
  // Add week-long vacations
  periods.push(...findWeekVacations(year, holidays));
  
  // Add extended vacations
  periods.push(...findExtendedVacations(year, holidays));
  
  // Add single strategic days
  periods.push(...findSingleDays(year, holidays));
  
  // Remove past periods
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return periods.filter(period => period.end >= today);
};

// Find bridge days (days between holidays/weekends)
const findBridgeDays = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check each weekday of the year
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      
      // Skip if the date is in the past
      if (currentDate < today) continue;
      
      // Skip weekends and holidays
      if (isDayOff(currentDate, holidays)) continue;
      
      const prevDay = addDays(currentDate, -1);
      const nextDay = addDays(currentDate, 1);
      
      // If both surrounding days are off, this is a bridge day
      if (isDayOff(prevDay, holidays) && isDayOff(nextDay, holidays)) {
        periods.push({
          start: currentDate,
          end: currentDate,
          totalDays: 3, // Including the surrounding off days
          vacationDaysUsed: 1,
          description: "Klämdag",
          type: "bridge",
          efficiency: 3.0
        });
      }
      
      // Also check for potential 4-day weekends by taking 1 day
      if ((getDay(currentDate) === 2 && isDayOff(prevDay, holidays)) || // Tuesday after Monday off
          (getDay(currentDate) === 4 && isDayOff(nextDay, holidays))) { // Thursday before Friday off
        periods.push({
          start: getDay(currentDate) === 2 ? addDays(currentDate, -3) : currentDate,
          end: getDay(currentDate) === 4 ? addDays(currentDate, 3) : currentDate,
          totalDays: 4,
          vacationDaysUsed: 1,
          description: "Förlängd helg",
          type: "longWeekend",
          efficiency: 4.0
        });
      }
    }
  }
  
  return periods;
};

// Find long weekends (3-4 day periods)
const findLongWeekends = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check for Thursday to Sunday long weekends
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Thursday to Sunday (4 days)
      const thursday = new Date(year, month, day);
      if (thursday < today || getDay(thursday) !== 4) continue;
      
      const sunday = addDays(thursday, 3);
      const vacationDaysNeeded = calculateVacationDaysNeeded(thursday, sunday, holidays);
      
      if (vacationDaysNeeded > 0) {
        periods.push({
          start: thursday,
          end: sunday,
          totalDays: 4,
          vacationDaysUsed: vacationDaysNeeded,
          description: "Torsdag till söndag",
          type: "longWeekend",
          efficiency: 4 / vacationDaysNeeded
        });
      }
      
      // Friday to Monday (4 days)
      const friday = new Date(year, month, day);
      if (friday < today || getDay(friday) !== 5) continue;
      
      const monday = addDays(friday, 3);
      const fridayToMondayVacationDays = calculateVacationDaysNeeded(friday, monday, holidays);
      
      if (fridayToMondayVacationDays > 0) {
        periods.push({
          start: friday,
          end: monday,
          totalDays: 4,
          vacationDaysUsed: fridayToMondayVacationDays,
          description: "Fredag till måndag",
          type: "longWeekend",
          efficiency: 4 / fridayToMondayVacationDays
        });
      }
    }
  }
  
  return periods;
};

// Find week-long vacation periods
const findWeekVacations = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find all Mondays in the year
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const monday = new Date(year, month, day);
      if (monday < today || getDay(monday) !== 1) continue;
      
      // One week (Monday to Sunday)
      const sunday = addDays(monday, 6);
      const vacationDaysNeeded = calculateVacationDaysNeeded(monday, sunday, holidays);
      
      if (vacationDaysNeeded > 0) {
        periods.push({
          start: monday,
          end: sunday,
          totalDays: 7,
          vacationDaysUsed: vacationDaysNeeded,
          description: "En veckas ledighet",
          type: "week",
          efficiency: 7 / vacationDaysNeeded
        });
      }
      
      // Two weeks (Monday to Sunday)
      const twoWeeksSunday = addDays(monday, 13);
      const twoWeeksVacationDays = calculateVacationDaysNeeded(monday, twoWeeksSunday, holidays);
      
      if (twoWeeksVacationDays > 0) {
        periods.push({
          start: monday,
          end: twoWeeksSunday,
          totalDays: 14,
          vacationDaysUsed: twoWeeksVacationDays,
          description: "Två veckors ledighet",
          type: "extended",
          efficiency: 14 / twoWeeksVacationDays
        });
      }
    }
  }
  
  return periods;
};

// Find extended vacation periods (10+ days)
const findExtendedVacations = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Summer periods
  const summerStarts = [
    new Date(year, 5, 15),  // Mid June
    new Date(year, 6, 1),   // Early July
    new Date(year, 6, 15),  // Mid July
    new Date(year, 7, 1)    // Early August
  ];
  
  for (const startDate of summerStarts) {
    if (startDate < today) continue;
    
    // Adjust to Monday
    let monday = new Date(startDate);
    while (getDay(monday) !== 1) {
      monday = addDays(monday, 1);
    }
    
    // Three weeks
    const threeWeeks = addDays(monday, 20);
    const threeWeeksVacationDays = calculateVacationDaysNeeded(monday, threeWeeks, holidays);
    
    if (threeWeeksVacationDays > 0) {
      periods.push({
        start: monday,
        end: threeWeeks,
        totalDays: 21,
        vacationDaysUsed: threeWeeksVacationDays,
        description: "Tre veckors sommarsemester",
        type: "extended",
        efficiency: 21 / threeWeeksVacationDays
      });
    }
  }
  
  // Christmas and New Year
  const christmasStart = new Date(year, 11, 20);
  if (christmasStart >= today) {
    const newYearEnd = new Date(year + 1, 0, 6);
    const christmasVacationDays = calculateVacationDaysNeeded(christmasStart, newYearEnd, holidays);
    
    if (christmasVacationDays > 0) {
      periods.push({
        start: christmasStart,
        end: newYearEnd,
        totalDays: differenceInDays(newYearEnd, christmasStart) + 1,
        vacationDaysUsed: christmasVacationDays,
        description: "Jul- och nyårsledighet",
        type: "extended",
        efficiency: (differenceInDays(newYearEnd, christmasStart) + 1) / christmasVacationDays
      });
    }
  }
  
  // Easter
  for (const holiday of holidays) {
    // Find Easter Sunday
    if (holiday.getMonth() === 3 || holiday.getMonth() === 4) {  // April or May
      if (isDayOff(addDays(holiday, 1), holidays)) {  // Check if the next day is Easter Monday
        const easterStart = addDays(holiday, -4);  // Thursday before Easter
        const easterEnd = addDays(holiday, 4);     // Friday after Easter
        
        if (easterStart >= today) {
          const easterVacationDays = calculateVacationDaysNeeded(easterStart, easterEnd, holidays);
          
          if (easterVacationDays > 0) {
            periods.push({
              start: easterStart,
              end: easterEnd,
              totalDays: 9,
              vacationDaysUsed: easterVacationDays,
              description: "Påskledighet",
              type: "extended",
              efficiency: 9 / easterVacationDays
            });
          }
        }
        break;
      }
    }
  }
  
  return periods;
};

// Find single strategic days
const findSingleDays = (year: number, holidays: Date[]): VacationPeriod[] => {
  const periods: VacationPeriod[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Prioritize Mondays and Fridays
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date < today) continue;
      
      // Skip weekends and holidays
      if (isDayOff(date, holidays)) continue;
      
      const dayOfWeek = getDay(date);
      
      // Monday or Friday
      if (dayOfWeek === 1 || dayOfWeek === 5) {
        periods.push({
          start: date,
          end: date,
          totalDays: dayOfWeek === 1 ? 3 : 3, // Including weekend
          vacationDaysUsed: 1,
          description: dayOfWeek === 1 ? "Ledig måndag" : "Ledig fredag",
          type: "single",
          efficiency: 3.0
        });
      }
    }
  }
  
  // Add other weekdays with lower priority
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date < today) continue;
      
      // Skip weekends and holidays
      if (isDayOff(date, holidays)) continue;
      
      const dayOfWeek = getDay(date);
      
      // Tuesday, Wednesday, Thursday
      if (dayOfWeek >= 2 && dayOfWeek <= 4) {
        periods.push({
          start: date,
          end: date,
          totalDays: 1,
          vacationDaysUsed: 1,
          description: "Enstaka ledig dag",
          type: "single",
          efficiency: 1.0
        });
      }
    }
  }
  
  return periods;
};

// Score periods based on selected mode
const scorePeriods = (periods: VacationPeriod[], mode: string): VacationPeriod[] => {
  return periods.map(period => {
    let score = period.efficiency || 1.0;
    
    // Base score on efficiency and days
    score *= 10;
    
    // Mode-specific scoring
    switch (mode) {
      case "longweekends":
        // Prioritize 3-4 day weekends
        if (period.totalDays <= 4) score += 40;
        break;
      
      case "minibreaks":
        // Prioritize mini breaks (5-6 days)
        if (period.totalDays >= 5 && period.totalDays <= 6) score += 40;
        break;
      
      case "weeks":
        // Prioritize weekly vacations
        if (period.totalDays >= 7 && period.totalDays <= 9) score += 40;
        break;
      
      case "extended":
        // Prioritize extended vacations
        if (period.totalDays >= 10) score += 40;
        break;
      
      case "balanced":
      default:
        // Balanced approach
        if (period.totalDays <= 4) score += 20;
        else if (period.totalDays <= 9) score += 25;
        else score += 30;
        break;
    }
    
    // Additional bonuses
    if (period.type === "bridge") score += 15;
    
    // Give summer vacations a boost in extended mode
    if (
      mode === "extended" && 
      period.type === "extended" && 
      (period.start.getMonth() >= 5 && period.start.getMonth() <= 7)
    ) {
      score += 20;
    }
    
    return { ...period, efficiency: score / 10 };
  }).sort((a, b) => (b.efficiency || 0) - (a.efficiency || 0));
};

// Select the optimal periods that use exactly the given number of vacation days
const selectOptimalPeriods = (
  scoredPeriods: VacationPeriod[], 
  targetVacationDays: number,
  holidays: Date[]
): VacationPeriod[] => {
  // First pass: Greedy algorithm to select high-scoring periods
  const selected: VacationPeriod[] = [];
  let remainingDays = targetVacationDays;
  
  // Copy periods to avoid modifying the original array
  const periodsCopy = [...scoredPeriods];
  
  // First try to select periods without overlaps
  for (let i = 0; i < periodsCopy.length; i++) {
    const period = periodsCopy[i];
    
    if (period.vacationDaysUsed <= remainingDays) {
      // Check for overlap with already selected periods
      const hasOverlap = selected.some(p => 
        doPeriodsOverlap(period.start, period.end, p.start, p.end)
      );
      
      if (!hasOverlap) {
        selected.push(period);
        remainingDays -= period.vacationDaysUsed;
        
        // If we've used exactly the target days, we're done
        if (remainingDays === 0) break;
      }
    }
  }
  
  // If we still have days left, try to fill with individual days
  if (remainingDays > 0) {
    const singleDays = findSingleDays(new Date().getFullYear(), holidays)
      .filter(day => !selected.some(p => 
        doPeriodsOverlap(day.start, day.end, p.start, p.end)
      ))
      .sort((a, b) => (b.efficiency || 0) - (a.efficiency || 0));
    
    for (const day of singleDays) {
      if (remainingDays <= 0) break;
      
      selected.push(day);
      remainingDays--;
    }
  }
  
  // If we still haven't used all days, we need to be more creative
  if (remainingDays > 0) {
    // Find workdays not in any selected period
    const allWorkdays: Date[] = [];
    const currentYear = new Date().getFullYear();
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(currentYear, 11, 31);
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // If it's a workday and not already in a selected period
      if (!isDayOff(currentDate, holidays) && 
          !selected.some(p => 
            currentDate >= p.start && currentDate <= p.end
          )) {
        allWorkdays.push(new Date(currentDate));
      }
      currentDate = addDays(currentDate, 1);
    }
    
    // Sort workdays by efficiency (prioritize those near weekends/holidays)
    const scoredWorkdays = allWorkdays.map(date => {
      const prevDay = addDays(date, -1);
      const nextDay = addDays(date, 1);
      
      let score = 1.0;
      
      // If adjacent to a day off, increase score
      if (isDayOff(prevDay, holidays) || isDayOff(nextDay, holidays)) {
        score = 2.0;
      }
      
      return { date, score };
    }).sort((a, b) => b.score - a.score);
    
    // Use the best individual days
    for (let i = 0; i < Math.min(remainingDays, scoredWorkdays.length); i++) {
      const date = scoredWorkdays[i].date;
      
      selected.push({
        start: date,
        end: date,
        totalDays: 1,
        vacationDaysUsed: 1,
        description: "Extra ledig dag",
        type: "single",
        efficiency: scoredWorkdays[i].score
      });
      
      remainingDays--;
    }
  }
  
  // Sort selected periods by date
  return selected.sort((a, b) => a.start.getTime() - b.start.getTime());
};
