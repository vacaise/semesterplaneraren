
import { VacationPeriod } from './types';

// Score periods based on optimization mode
export const scorePeriods = (
  periods: VacationPeriod[], 
  mode: string, 
  targetVacationDays: number = 0
): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
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
