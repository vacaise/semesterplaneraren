
import { VacationPeriod } from './types';

// Score periods based on optimization mode
export const scorePeriods = (periods: VacationPeriod[], mode: string, vacationDays: number): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
  // Calculate total vacation days used in all periods
  const totalVacationDaysUsed = scoredPeriods.reduce((sum, period) => sum + period.vacationDaysNeeded, 0);
  
  // Apply base scores based on period characteristics
  scoredPeriods.forEach(period => {
    // Default base score if not set
    if (period.score === undefined) {
      period.score = 0;
    }
    
    // Apply mode-specific scoring
    if (mode === "longweekends" && period.days <= 4) {
      period.score += 50;
    } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
      period.score += 50;
    } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
      period.score += 50;
    } else if (mode === "extended" && period.days > 9) {
      period.score += 50;
    } else if (mode === "balanced") {
      // For balanced mode, give even scoring across different period lengths
      if (period.days <= 4) period.score += 30;
      else if (period.days <= 6) period.score += 30;
      else if (period.days <= 9) period.score += 30;
      else period.score += 30;
    }
    
    // Apply penalties to periods that don't match the selected mode
    if (mode === "longweekends" && period.days > 4) {
      period.score -= 20;
    }
    if (mode === "minibreaks" && (period.days <= 4 || period.days > 6)) {
      period.score -= 20;
    }
    if (mode === "weeks" && (period.days <= 6 || period.days > 9)) {
      period.score -= 20;
    }
    if (mode === "extended" && period.days <= 9) {
      period.score -= 20;
    }
    
    // Add reward or penalty based on vacation days usage
    // This is applied to each period proportionally to its contribution to the total
    if (totalVacationDaysUsed < vacationDays) {
      // INCREASED Penalty for not using all vacation days
      const unusedDays = vacationDays - totalVacationDaysUsed;
      const penaltyPerDay = 30; // Increased from 5 to 30
      const totalPenalty = unusedDays * penaltyPerDay;
      
      // Apply proportional penalty to this period
      const proportionalPenalty = totalPenalty * (period.vacationDaysNeeded / Math.max(totalVacationDaysUsed, 1));
      period.score -= proportionalPenalty;
    } 
    else if (totalVacationDaysUsed > vacationDays) {
      // INCREASED Penalty for using too many vacation days
      const excessDays = totalVacationDaysUsed - vacationDays;
      const penaltyPerDay = 40; // Increased from 10 to 40
      const totalPenalty = excessDays * penaltyPerDay;
      
      // Apply proportional penalty to this period
      const proportionalPenalty = totalPenalty * (period.vacationDaysNeeded / totalVacationDaysUsed);
      period.score -= proportionalPenalty;
    } 
    else if (totalVacationDaysUsed === vacationDays) {
      // Increased Reward for using exactly the right number of days
      period.score += 50; // Increased from 25 to 50
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
