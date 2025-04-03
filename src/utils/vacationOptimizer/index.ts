
import { optimizeVacation } from './optimizer';
import { 
  calculateEfficiency, 
  calculateVacationDaysNeeded, 
  isWorkday, 
  formatDateRange,
  getMonthName,
  isDateInPast,
  isDayOff
} from './calculators';
import { VacationPeriod, OptimizedSchedule, OptimizationMode } from './types';
import { findAllPotentialPeriods } from './potentialPeriodFinder';
import { findOptimalVacationPeriods } from './periodFinder';
import { sortPeriodsByModeAndEfficiency, selectOptimalPeriods } from './periodSelector';

export { 
  optimizeVacation,
  calculateEfficiency,
  calculateVacationDaysNeeded,
  isWorkday,
  formatDateRange,
  getMonthName,
  isDateInPast,
  isDayOff,
  findAllPotentialPeriods,
  findOptimalVacationPeriods,
  sortPeriodsByModeAndEfficiency,
  selectOptimalPeriods
};

export type { 
  VacationPeriod,
  OptimizedSchedule,
  OptimizationMode
};
