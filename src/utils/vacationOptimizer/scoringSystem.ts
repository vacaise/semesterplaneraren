
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
    
    // Apply mode-specific scoring with much stronger emphasis
    if (mode === "longweekends" && period.days <= 4) {
      period.score += 180; // Increased from 100
    } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
      period.score += 180; // Increased from 100
    } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
      period.score += 180; // Increased from 100
    } else if (mode === "extended" && period.days > 9) {
      period.score += 180; // Increased from 100
    } else if (mode === "balanced") {
      // For balanced mode, still give varied scoring but with adjusted weights
      if (period.days <= 4) period.score += 60;
      else if (period.days <= 6) period.score += 80;
      else if (period.days <= 9) period.score += 100;
      else period.score += 110;
    }
    
    // Apply stronger penalties to periods that don't match the selected mode
    if (mode === "longweekends" && period.days > 4) {
      const penalty = Math.min(100, 60 + ((period.days - 4) * 15)); // Progressive penalty
      period.score -= penalty;
    }
    if (mode === "minibreaks" && period.days <= 4) {
      period.score -= 80; // Stronger penalty
    }
    if (mode === "minibreaks" && period.days > 6) {
      const penalty = Math.min(100, 60 + ((period.days - 6) * 10)); // Progressive penalty
      period.score -= penalty;
    }
    if (mode === "weeks" && period.days <= 6) {
      period.score -= 80; // Stronger penalty
    }
    if (mode === "weeks" && period.days > 9) {
      const penalty = Math.min(100, 60 + ((period.days - 9) * 10)); // Progressive penalty
      period.score -= penalty;
    }
    if (mode === "extended" && period.days <= 9) {
      const penalty = Math.min(120, 70 + ((9 - period.days) * 10)); // Stronger progressive penalty
      period.score -= penalty;
    }

    // Reward periods that have better vacation day efficiency with more weight
    const efficiency = period.days / Math.max(period.vacationDaysNeeded, 1);
    period.score += Math.min(efficiency * 40, 80); // Slightly higher than before
    
    // Give extra points for extremely efficient periods
    if (efficiency > 2.5) {
      period.score += 60; // Increased from 50
    }
    
    // Heavy boost for periods that include holidays (significantly increased)
    if (period.type === "holiday" || period.type === "bridge") {
      period.score += 120; // Increased from 90 to prioritize holidays even more
    }
    
    // Apply mode-specific optimizations for holidays
    if ((period.type === "holiday" || period.type === "bridge")) {
      if (mode === "longweekends" && period.days <= 4) {
        period.score += 40; // Extra boost for holiday long weekends
      } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
        period.score += 40; // Extra boost for holiday mini-breaks
      } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
        period.score += 40; // Extra boost for holiday weeks
      } else if (mode === "extended" && period.days > 9) {
        period.score += 50; // Extra boost for extended holiday periods
      }
    }
    
    // Add score boost for summer periods in July-August with mode-specific adjustments
    const periodMonth = new Date(period.start).getMonth();
    if ((periodMonth === 6 || periodMonth === 7)) {
      // Different summer boosts based on mode
      if (mode === "extended") {
        period.score += 45; // Extended summer vacations get significant boost
      } else if (mode === "weeks") {
        period.score += 25; // Week-long summer periods get moderate boost
      } else {
        period.score += 15; // Other modes get smaller boost
      }
    }
    
    // Add score boost for winter holiday periods (December-January)
    if (periodMonth === 11 || periodMonth === 0) {
      if (mode === "longweekends" || mode === "minibreaks") {
        period.score += 35; // More boost for short winter breaks
      } else {
        period.score += 25; // Standard boost for winter periods
      }
    }
    
    // Add bonus for longer continuous periods - highly reward creating long breaks
    // Adjust based on mode
    if (period.days >= 9) {
      if (mode === "extended") {
        period.score += Math.min(period.days * 5, 75); // Much higher bonus for extended mode
      } else if (mode === "weeks") {
        period.score += Math.min(period.days * 4, 60); // Higher bonus for weeks mode
      } else if (mode === "balanced") {
        period.score += Math.min(period.days * 3, 45); // Standard bonus for balanced mode
      } else {
        // Small or even negative bonus for modes that prefer shorter breaks
        period.score += Math.min(period.days * 1, 15);
      }
    }
    
    // Special scoring for spring breaks (March-April)
    if (periodMonth === 2 || periodMonth === 3) {
      if (mode === "minibreaks") {
        period.score += 20; // Spring is good for mini-breaks
      } else if (mode === "weeks") {
        period.score += 15; // And for week-long breaks
      }
    }
    
    // Special scoring for autumn breaks (September-October)
    if (periodMonth === 8 || periodMonth === 9) {
      if (mode === "longweekends") {
        period.score += 20; // Autumn is good for long weekends
      } else if (mode === "minibreaks") {
        period.score += 15; // And for mini-breaks
      }
    }
    
    // Super-boost for periods that have high efficiency AND include holidays
    if (efficiency > 2.0 && (period.type === "holiday" || period.type === "bridge")) {
      period.score += 70; // Big boost for the most efficient holiday periods
    }
    
    // Extra boost for December periods that are highly efficient (Christmas optimization)
    if (periodMonth === 11 && efficiency > 2.0) {
      period.score += 60;
    }
  });
  
  return scoredPeriods;
};
