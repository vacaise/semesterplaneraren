
export interface VacationPeriod {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
  score?: number;
  startDate?: string; // Optional for display purposes
  endDate?: string;   // Optional for display purposes
}

export type OptimizationMode = 
  | "balanced"     // Mix of short and long periods
  | "longweekends" // Focus on extending weekends
  | "minibreaks"   // Short breaks (4-6 days)
  | "weeks"        // Full week breaks
  | "extended";    // Long vacation periods

export type DayType = "holiday" | "weekend" | "vacation" | "company" | "workday";
