
import { VacationPeriod } from './types';

// Score periods based on optimization mode and efficiency
export const scorePeriods = (periods: VacationPeriod[], mode: string): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
  // Apply base scores based on period characteristics and mode preference
  scoredPeriods.forEach(period => {
    // Default base score if not set
    if (period.score === undefined) {
      period.score = 0;
    }
    
    // Calculate efficiency (days per vacation day)
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    
    // Bonus score for high efficiency
    period.score += Math.floor((efficiency - 1) * 15);
    
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
    
    // Bonus for special period types
    switch(period.type) {
      case "bridge":
        period.score += 10; // Bridge days are efficient
        break;
      case "summer": 
        if (mode === "extended") {
          period.score += 15; // Summer periods are good for extended mode
        }
        break;
      case "holiday":
        period.score += 8; // Holiday periods are culturally important
        break;
    }
  });
  
  // Sort periods based on mode preference and score
  scoredPeriods.sort((a, b) => {
    // Sort by score (higher score first)
    return (b.score || 0) - (a.score || 0);
  });
  
  return scoredPeriods;
};
