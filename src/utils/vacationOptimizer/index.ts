
import { optimizeDays, optimizeDaysAsync, findOptimalSchedule } from './optimizer';
import { formatDate, isDayOff, isDateInPast } from './helpers';
import { OptimizationParams, OptimizationResult, VacationPeriod, OptimizationStrategy } from './types';

export {
  optimizeDays,
  optimizeDaysAsync,
  findOptimalSchedule, // For backward compatibility
  formatDate,
  isDayOff,
  isDateInPast
};

export type {
  OptimizationParams,
  OptimizationResult,
  VacationPeriod,
  OptimizationStrategy
};
