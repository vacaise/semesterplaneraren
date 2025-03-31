
import { VacationPeriod } from './types';
import { isDayOff } from './helpers';

// Score periods based on optimization mode
export const scorePeriods = (periods: VacationPeriod[], mode: string, holidays: Date[]): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
  // Apply base scores based on period characteristics
  scoredPeriods.forEach(period => {
    // Default base score if not set
    if (period.score === undefined) {
      period.score = 0;
    }
    
    // Apply mode-specific scoring with stronger emphasis
    if (mode === "longweekends" && period.days <= 4) {
      period.score += 80; // Increased from 50 to 80
    } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
      period.score += 80; // Increased from 50 to 80
    } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
      period.score += 80; // Increased from 50 to 80
    } else if (mode === "extended" && period.days > 9) {
      period.score += 80; // Increased from 50 to 80
    } else if (mode === "balanced") {
      // For balanced mode, give even scoring across different period lengths
      if (period.days <= 4) period.score += 30;
      else if (period.days <= 6) period.score += 30;
      else if (period.days <= 9) period.score += 30;
      else period.score += 30;
    }
    
    // Apply stronger penalties to periods that don't match the selected mode
    if (mode === "longweekends" && period.days > 4) {
      period.score -= (period.days > 6) ? 40 : 30; // Steeper penalty for periods further from the preferred type
    }
    if (mode === "minibreaks" && (period.days <= 4 || period.days > 6)) {
      period.score -= (period.days > 9 || period.days <= 2) ? 40 : 30;
    }
    if (mode === "weeks" && (period.days <= 6 || period.days > 9)) {
      period.score -= (period.days <= 4 || period.days > 12) ? 40 : 30;
    }
    if (mode === "extended" && period.days <= 9) {
      period.score -= period.days <= 6 ? 40 : 30;
    }
    
    // NEW: Score based on holiday inclusion
    // Count how many holidays are included in the period
    let holidayCount = 0;
    let currentDay = new Date(period.start);
    const endDate = new Date(period.end);
    
    while (currentDay <= endDate) {
      const isHoliday = holidays.some(holiday => 
        holiday.getDate() === currentDay.getDate() && 
        holiday.getMonth() === currentDay.getMonth() && 
        holiday.getFullYear() === currentDay.getFullYear()
      );
      
      if (isHoliday) {
        holidayCount++;
      }
      
      // Move to next day
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    // Give bonus points for periods that include holidays
    // The more holidays included, the higher the score boost
    if (holidayCount > 0) {
      // Base bonus for including any holidays
      const baseHolidayBonus = 10;
      
      // Additional bonus per holiday (higher for extended vacations)
      const perHolidayBonus = mode === "extended" ? 15 : 8;
      
      period.score += baseHolidayBonus + (holidayCount * perHolidayBonus);
      
      // For extended vacations, give extra emphasis to periods with multiple holidays
      if (mode === "extended" && holidayCount >= 2) {
        period.score += 25;
      }
    }
  });
  
  // Sort periods based on mode preference and chronologically (starting with nearest date)
  scoredPeriods.sort((a, b) => {
    // First sort by start date (chronologically)
    const aStartTime = new Date(a.start).getTime();
    const bStartTime = new Date(b.start).getTime();
    
    if (aStartTime !== bStartTime) {
      return aStartTime - bStartTime; // Earlier periods first
    }
    
    // If dates are the same, sort by score (higher score first)
    return (b.score || 0) - (a.score || 0);
  });
  
  return scoredPeriods;
};
