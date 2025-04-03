
import { VacationPeriod } from './types';
import { isDayOff } from './helpers';

// Score periods based on optimization mode and efficiency
export const scorePeriods = (periods: VacationPeriod[], mode: string): VacationPeriod[] => {
  const scoredPeriods = [...periods];
  
  // Apply scores based on period characteristics and user preferences
  scoredPeriods.forEach(period => {
    // Default base score if not set
    if (period.score === undefined) {
      period.score = 0;
    }
    
    // Calculate efficiency (days off per vacation day)
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    
    // Apply mode-specific scoring with stronger weighting
    switch(mode) {
      case "longweekends":
        // Strong preference for 2-4 day periods
        if (period.days <= 4) period.score += 120;
        else if (period.days <= 6) period.score += 40;
        else period.score -= 50;
        break;
        
      case "minibreaks":
        // Strong preference for 4-6 day periods
        if (period.days > 4 && period.days <= 6) period.score += 120;
        else if (period.days <= 4 || period.days <= 8) period.score += 40;
        else period.score -= 40;
        break;
        
      case "weeks":
        // Strong preference for 7-9 day periods (full weeks)
        if (period.days > 6 && period.days <= 9) period.score += 120;
        else if (period.days > 4 && period.days <= 12) period.score += 40;
        else period.score -= 40;
        break;
        
      case "extended":
        // Strong preference for periods longer than 9 days
        if (period.days > 9) period.score += 120;
        else if (period.days > 6) period.score += 40;
        else period.score -= 50;
        break;
        
      case "balanced":
      default:
        // For balanced mode, give more progressive scoring across different period lengths
        if (period.days <= 4) period.score += 40; // Long weekends
        else if (period.days <= 7) period.score += 60; // Mini breaks
        else if (period.days <= 10) period.score += 80; // Weeks
        else period.score += 90; // Extended vacations
        break;
    }
    
    // Extra bonus for high-efficiency periods - increased weights
    if (efficiency >= 2.0) period.score += 80;
    else if (efficiency >= 1.7) period.score += 60;
    else if (efficiency >= 1.5) period.score += 40;
    
    // Much higher bonus for periods that include holidays - prioritize holiday utilization
    if (period.type === "holiday") period.score += 100;
    
    // Bonus for summer periods (most people prefer summer vacation)
    if (period.type === "summer") period.score += 50;
    
    // Significant bonus for bridge days (extremely efficient)
    if (period.type === "bridge") period.score += 90;
  });
  
  // Sort periods based on score (higher score first)
  scoredPeriods.sort((a, b) => {
    return (b.score || 0) - (a.score || 0);
  });
  
  return scoredPeriods;
};

// Enhanced scoring for period combinations
export const scoreCombination = (
  combination: VacationPeriod[],
  mode: string,
  holidays: Date[]
): number => {
  let totalScore = 0;
  
  // Base score from individual periods
  const baseScore = combination.reduce((sum, period) => sum + (period.score || 0), 0);
  
  // Length alignment score based on selected mode with higher weights
  let lengthScore = 0;
  combination.forEach(period => {
    const periodLength = period.days;
    
    switch(mode) {
      case "longweekends":
        lengthScore += periodLength <= 4 ? 80 : 10;
        break;
      case "minibreaks":
        lengthScore += (periodLength >= 4 && periodLength <= 6) ? 80 : 10;
        break;
      case "weeks":
        lengthScore += (periodLength >= 7 && periodLength <= 9) ? 80 : 10;
        break;
      case "extended":
        lengthScore += periodLength >= 10 ? 80 : 10;
        break;
      case "balanced":
      default:
        if (periodLength <= 4) lengthScore += 25;
        else if (periodLength <= 7) lengthScore += 35;
        else if (periodLength <= 10) lengthScore += 45;
        else lengthScore += 40;
    }
  });
  
  // Distribution score - favor spreading periods throughout the year
  const monthCoverage = new Set(combination.map(p => new Date(p.start).getMonth())).size;
  const distributionScore = monthCoverage * 20;
  
  // Efficiency score - maximize total days off
  const totalDays = combination.reduce((sum, period) => sum + period.days, 0);
  const efficiencyScore = totalDays * 3;
  
  // Holiday utilization score - strongly favor periods that include holidays
  let holidayScore = 0;
  combination.forEach(period => {
    const start = new Date(period.start);
    const end = new Date(period.end);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (holidays.some(h => h.getDate() === d.getDate() && h.getMonth() === d.getMonth())) {
        holidayScore += 40; // Significant bonus for each holiday included
      }
    }
  });
  
  // Calculate final score with weighted components
  totalScore = baseScore + lengthScore + distributionScore + efficiencyScore + holidayScore;
  
  return totalScore;
};
