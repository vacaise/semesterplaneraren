
import { addDays } from 'date-fns';
import { isDayOff } from '../helpers';
import { VacationPeriod } from '../types';
import { createPeriod, getMonthName } from './periodUtils';

// Generate custom periods for specific vacation day counts
export function generateCustomPeriods(year: number, exactVacationDays: number, holidays: Date[]): VacationPeriod[] {
  const customPeriods: VacationPeriod[] = [];
  const now = new Date();
  
  // Try to generate periods with exactly the vacation days needed
  // Prioritize months with good weather (based on northern hemisphere)
  const priorityMonths = [5, 6, 7, 8, 4, 9, 3, 10, 2, 11, 0, 1]; // Jun, Jul, Aug, May, Sep, ...
  
  for (const month of priorityMonths) {
    for (let startDay = 1; startDay <= 21; startDay += 3) {
      // Try starting on different days of the week for variety
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const startDate = new Date(year, month, startDay + dayOffset);
        
        // Skip if in the past
        if (startDate < now) continue;
        
        let currentDay = new Date(startDate);
        let periodVacationDays = 0;
        let totalDays = 0;
        
        // Extend until we reach the exact vacation day count
        while (periodVacationDays < exactVacationDays && totalDays < 50) {
          if (!isDayOff(currentDay, holidays)) {
            periodVacationDays++;
          }
          
          totalDays++;
          currentDay.setDate(currentDay.getDate() + 1);
          
          // If we've reached the exact count, create the period
          if (periodVacationDays === exactVacationDays) {
            const endDate = new Date(currentDay);
            endDate.setDate(currentDay.getDate() - 1); // Back up one day
            
            const period = createPeriod(
              startDate,
              endDate,
              holidays,
              `${exactVacationDays} dagars semester`,
              "custom"
            );
            period.score = 60; // Good score for exact match
            customPeriods.push(period);
            break;
          }
        }
      }
    }
  }
  
  // Create periods that can be combined (half the days, a third of the days, etc.)
  if (exactVacationDays > 5) {
    const divisions = [2, 3, 4].filter(div => exactVacationDays >= div);
    
    for (const divisor of divisions) {
      const partSize = Math.floor(exactVacationDays / divisor);
      
      // Skip trivial cases
      if (partSize < 2) continue;
      
      // Create periods for this part size
      for (const month of priorityMonths) {
        for (let startDay = 1; startDay <= 25; startDay += 5) {
          const startDate = new Date(year, month, startDay);
          
          // Skip if in the past
          if (startDate < now) continue;
          
          let currentDay = new Date(startDate);
          let periodVacationDays = 0;
          let totalDays = 0;
          
          // Extend until we reach the part size
          while (periodVacationDays < partSize && totalDays < 20) {
            if (!isDayOff(currentDay, holidays)) {
              periodVacationDays++;
            }
            
            totalDays++;
            currentDay.setDate(currentDay.getDate() + 1);
          }
          
          // If we reached the part size exactly
          if (periodVacationDays === partSize) {
            const endDate = new Date(currentDay);
            endDate.setDate(currentDay.getDate() - 1); // Back up one day
            
            const period = createPeriod(
              startDate,
              endDate,
              holidays,
              `${partSize} dagars delar`,
              "split"
            );
            period.score = 45;
            customPeriods.push(period);
          }
        }
      }
    }
  }
  
  // If total vacation days is small, also add single day options
  if (exactVacationDays <= 15) {
    const singleDays = generateSingleDayPeriods(year, holidays);
    customPeriods.push(...singleDays);
  }
  
  return customPeriods;
}

// Generate single-day vacation periods
export function generateSingleDayPeriods(year: number, holidays: Date[]): VacationPeriod[] {
  const singleDayPeriods: VacationPeriod[] = [];
  const now = new Date();
  
  // Create single day options (especially near holidays and on Fridays/Mondays)
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const date = new Date(year, month, day);
      
      // Skip if in the past or a day off
      if (date < now || isDayOff(date, holidays)) continue;
      
      // Check the day of week (prioritize Mondays and Fridays)
      const dayOfWeek = date.getDay();
      const isStrategicDay = dayOfWeek === 1 || dayOfWeek === 5; // Monday or Friday
      
      // Check if it's adjacent to a holiday
      const prevDay = new Date(date);
      prevDay.setDate(date.getDate() - 1);
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const nextToDayOff = isDayOff(prevDay, holidays) || isDayOff(nextDay, holidays);
      
      // Create the period
      const period = createPeriod(
        date,
        date,
        holidays,
        `Ledig ${date.getDate()} ${getMonthName(month)}`,
        "single"
      );
      
      // Score based on strategic placement
      period.score = isStrategicDay ? 50 : 30;
      if (nextToDayOff) period.score += 20;
      
      singleDayPeriods.push(period);
    }
  }
  
  return singleDayPeriods;
}
