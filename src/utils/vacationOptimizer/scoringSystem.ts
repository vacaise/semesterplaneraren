
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
      period.score += 80;
    } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
      period.score += 80;
    } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
      period.score += 80;
    } else if (mode === "extended" && period.days > 9) {
      period.score += 80;
    } else if (mode === "balanced") {
      // For balanced mode, give more varied scoring across different period lengths
      if (period.days <= 4) period.score += 40;
      else if (period.days <= 6) period.score += 50;
      else if (period.days <= 9) period.score += 60;
      else period.score += 70;
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

    // Reward periods that have better vacation day efficiency
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    period.score += Math.min(efficiency * 15, 30); // Cap the bonus at 30 points
    
    // Reward periods that include holidays
    if (period.type === "holiday" || period.type === "bridge") {
      period.score += 25;
    }
    
    // Add score boost for summer periods in July-August if not in extended mode
    const periodMonth = new Date(period.start).getMonth();
    if ((periodMonth === 6 || periodMonth === 7) && mode !== "extended") {
      period.score += 15;
    }
    
    // Add score boost for winter holiday periods (December-January)
    if (periodMonth === 11 || periodMonth === 0) {
      period.score += 20;
    }
  });
  
  return scoredPeriods;
};
