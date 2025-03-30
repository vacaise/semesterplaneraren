
import { VacationPeriod } from './types';

// Score periods based on optimization mode
export const scorePeriods = (periods: VacationPeriod[], mode: string): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
  // Sort periods based on mode preference and chronologically (starting with nearest date)
  scoredPeriods.sort((a, b) => {
    // First sort by start date (chronologically)
    const aStartTime = new Date(a.start).getTime();
    const bStartTime = new Date(b.start).getTime();
    
    if (aStartTime !== bStartTime) {
      return aStartTime - bStartTime; // Earlier periods first
    }
    
    // If dates are the same, sort by score and mode preference
    let aScore = a.score || 0;
    let bScore = b.score || 0;
    
    // Adjust scores based on optimization mode
    if (mode === "longweekends" && a.days <= 4) aScore += 30;
    if (mode === "longweekends" && b.days <= 4) bScore += 30;
    
    if (mode === "minibreaks" && a.days <= 6 && a.days > 4) aScore += 30;
    if (mode === "minibreaks" && b.days <= 6 && b.days > 4) bScore += 30;
    
    if (mode === "weeks" && a.days <= 9 && a.days > 6) aScore += 30;
    if (mode === "weeks" && b.days <= 9 && b.days > 6) bScore += 30;
    
    if (mode === "extended" && a.days > 9) aScore += 30;
    if (mode === "extended" && b.days > 9) bScore += 30;
    
    // Sort by score, higher score first
    return bScore - aScore;
  });
  
  return scoredPeriods;
};
