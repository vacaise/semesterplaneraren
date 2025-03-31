
import { VacationPeriod } from '../types';

// Define the primary period criteria based on the selected mode
export const isPrimaryPeriod = (period: VacationPeriod, mode: string): boolean => {
  if (mode === "longweekends" && period.days <= 4) {
    return true;
  } else if (mode === "minibreaks" && period.days <= 6 && period.days > 4) {
    return true;
  } else if (mode === "weeks" && period.days <= 9 && period.days > 6) {
    return true;
  } else if (mode === "extended" && period.days > 9) {
    return true;
  } else if (mode === "balanced") {
    return true; // In balanced mode, all periods can be primary
  }
  return false;
};

// Define the secondary period criteria - periods that are close to the preferred style
export const isSecondaryPeriod = (period: VacationPeriod, mode: string): boolean => {
  if (mode === "longweekends" && period.days <= 6) {
    return true; // Minibreaks are secondary for longweekends
  } else if (mode === "minibreaks" && (period.days <= 4 || (period.days <= 9 && period.days > 6))) {
    return true; // Longweekends and Weeks are secondary for minibreaks
  } else if (mode === "weeks" && (period.days <= 6 && period.days > 4 || period.days > 9)) {
    return true; // Minibreaks and Extended are secondary for weeks
  } else if (mode === "extended" && period.days <= 9 && period.days > 6) {
    return true; // Weeks are secondary for extended
  } else if (mode === "balanced") {
    return false; // In balanced mode, all periods are already primary
  }
  return false;
};
