
/**
 * Defines types used throughout the vacation optimizer
 */

/**
 * Represents a vacation period
 */
export interface VacationPeriod {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded?: number;
  description?: string;
  type?: string;
  score?: number;
}
