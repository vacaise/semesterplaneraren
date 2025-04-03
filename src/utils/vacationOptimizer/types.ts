
export interface VacationPeriod {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
  score?: number;
}

export type OptimizationMode = 
  | "balanced"     // Mix of short and long periods
  | "longweekends" // Focus on extending weekends
  | "minibreaks"   // Short breaks (4-6 days)
  | "weeks"        // Full week breaks
  | "extended";    // Long vacation periods

export interface OptimizedSchedule {
  totalDaysOff: number;
  vacationDaysUsed: number;
  mode: string;
  periods: VacationPeriod[];
}
