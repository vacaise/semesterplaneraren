
import { VacationPeriod } from './types';

// Score periods based on optimization mode
export const scorePeriods = (periods: VacationPeriod[], mode: string): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
  // Apply base scores based on period characteristics
  scoredPeriods.forEach(period => {
    // Default base score if not set
    if (period.score === undefined) {
      period.score = 0;
    }
    
    // Apply mode-specific scoring with higher differentiation
    if (mode === "longweekends" && period.days <= 4) {
      period.score += 80; // Higher score for exact match
    } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
      period.score += 80;
    } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
      period.score += 80;
    } else if (mode === "extended" && period.days > 9) {
      period.score += 80;
    } else if (mode === "balanced") {
      // For balanced mode, give even scoring across different period lengths
      if (period.days <= 4) period.score += 40;
      else if (period.days <= 6) period.score += 40;
      else if (period.days <= 9) period.score += 40;
      else period.score += 40;
    }
    
    // Apply stronger penalties to periods that don't match the selected mode
    if (mode === "longweekends" && period.days > 4) {
      period.score -= 40;
    }
    if (mode === "minibreaks" && (period.days <= 4 || period.days > 6)) {
      period.score -= 40;
    }
    if (mode === "weeks" && (period.days <= 6 || period.days > 9)) {
      period.score -= 40;
    }
    if (mode === "extended" && period.days <= 9) {
      period.score -= 40;
    }
    
    // Extra bonus for high-efficiency periods (many days off per vacation day)
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    if (efficiency >= 2.0) {
      period.score += 30;
    } else if (efficiency >= 1.5) {
      period.score += 20;
    }
  });
  
  // Sort periods based on both score and chronological order
  scoredPeriods.sort((a, b) => {
    // First prioritize by score (higher score first)
    const scoreDiff = (b.score || 0) - (a.score || 0);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    
    // If scores are equal, sort by start date (chronologically)
    const aStartTime = new Date(a.start).getTime();
    const bStartTime = new Date(b.start).getTime();
    
    return aStartTime - bStartTime; // Earlier periods first
  });
  
  return scoredPeriods;
};
