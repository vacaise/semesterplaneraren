
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
    
    // Apply mode-specific scoring
    switch(mode) {
      case "longweekends":
        // Strong preference for 2-4 day periods
        if (period.days <= 4) period.score += 80;
        else if (period.days <= 6) period.score += 40;
        else period.score -= 20;
        break;
        
      case "minibreaks":
        // Strong preference for 4-6 day periods
        if (period.days > 4 && period.days <= 6) period.score += 80;
        else if (period.days <= 4 || period.days <= 8) period.score += 40;
        else period.score -= 20;
        break;
        
      case "weeks":
        // Strong preference for 7-9 day periods (full weeks)
        if (period.days > 6 && period.days <= 9) period.score += 80;
        else if (period.days > 4 && period.days <= 12) period.score += 30;
        else period.score -= 10;
        break;
        
      case "extended":
        // Strong preference for periods longer than 9 days
        if (period.days > 9) period.score += 80;
        else if (period.days > 6) period.score += 30;
        else period.score -= 20;
        break;
        
      case "balanced":
      default:
        // For balanced mode, give even scoring across different period lengths
        if (period.days <= 4) period.score += 40; // Long weekends
        else if (period.days <= 7) period.score += 50; // Mini breaks
        else if (period.days <= 10) period.score += 60; // Weeks
        else period.score += 70; // Extended vacations
        break;
    }
    
    // Extra bonus for high-efficiency periods
    if (efficiency >= 2.0) period.score += 40;
    else if (efficiency >= 1.7) period.score += 30;
    else if (efficiency >= 1.5) period.score += 20;
    
    // Bonus for holiday periods
    if (period.type === "holiday") period.score += 30;
    
    // Bonus for summer periods (most people prefer summer vacation)
    if (period.type === "summer") period.score += 25;
    
    // Bonus for bridge days (very efficient)
    if (period.type === "bridge") period.score += 20;
  });
  
  // Sort periods based on score (higher score first)
  scoredPeriods.sort((a, b) => {
    return (b.score || 0) - (a.score || 0);
  });
  
  return scoredPeriods;
};
