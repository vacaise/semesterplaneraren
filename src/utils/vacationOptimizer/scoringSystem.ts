
import { VacationPeriod } from './types';
import { isDayOff } from './helpers';
import { calculateVacationDaysNeeded } from './calculators';

// Score periods based on optimization mode and efficiency
export const scorePeriods = (periods: VacationPeriod[], mode: string, holidays: Date[]): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
  // Calculate efficiency for each period to use in scoring
  scoredPeriods.forEach(period => {
    // Default base score if not set
    if (period.score === undefined) {
      period.score = 0;
    }
    
    // Calculate actual vacation days needed for each period
    if (period.vacationDaysNeeded === undefined) {
      period.vacationDaysNeeded = calculateVacationDaysNeeded(period.start, period.end, holidays);
    }
    
    // Calculate efficiency ratio (days off / vacation days needed)
    const efficiencyRatio = period.vacationDaysNeeded > 0 
      ? period.days / period.vacationDaysNeeded 
      : 0;
    
    // Add efficiency bonus - higher efficiency = higher score
    // Use a sliding scale where efficiency above 1.5 starts to get significant bonuses
    if (efficiencyRatio >= 2.0) {
      // Exponentially increase the bonus for high efficiency ratios
      period.score += Math.pow(efficiencyRatio - 1, 2) * 50; // Increased from 30 to 50
    } else if (efficiencyRatio >= 1.5) {
      period.score += Math.pow(efficiencyRatio - 1, 2) * 40; // Increased from 30 to 40
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
      // For balanced mode, create a true mix by giving higher scores to different period types
      // but with slight preference for shorter periods (they're more efficient)
      if (period.days <= 4) period.score += 60; // Longweekends get good score
      else if (period.days <= 6) period.score += 50; // Minibreaks get good score
      else if (period.days <= 9) period.score += 40; // Weeks get moderate score 
      else period.score += 30; // Extended periods get lower but still significant score
    }
    
    // Apply stronger penalties to periods that don't match the selected mode
    // But don't apply these penalties in balanced mode
    if (mode !== "balanced") {
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
    }
    
    // Score based on holiday inclusion
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
      const baseHolidayBonus = 15; // Increased from 10 to 15
      
      // Additional bonus per holiday (higher for extended vacations)
      const perHolidayBonus = mode === "extended" ? 20 : 15; // Increased from 15/8 to 20/15
      
      period.score += baseHolidayBonus + (holidayCount * perHolidayBonus);
      
      // For extended vacations, give extra emphasis to periods with multiple holidays
      if (mode === "extended" && holidayCount >= 2) {
        period.score += 25;
      }
    }
    
    // Final efficiency multiplier - give more weight to efficient periods
    // This helps find periods like in the example (Jun 16-22 with 4 vacation days)
    if (efficiencyRatio > 2.0) {
      period.score *= 1.5; // Significant boost for very efficient periods (increased from 1.3)
    } else if (efficiencyRatio > 1.75) {
      period.score *= 1.3; // Significant boost for very efficient periods (increased from 1.2)
    } else if (efficiencyRatio > 1.5) {
      period.score *= 1.2; // Good boost for efficient periods (kept the same)
    } else if (efficiencyRatio > 1.25) {
      period.score *= 1.1; // Small boost for somewhat efficient periods (kept the same)
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
