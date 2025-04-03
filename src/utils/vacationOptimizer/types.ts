
export interface VacationPeriod {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
  startDate?: string; // For display purposes
  endDate?: string;   // For display purposes
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

export interface PotentialPeriod {
  start: Date;
  end: Date;
  vacationDaysNeeded: number;
  totalDays: number;
  efficiency: number;
  description: string;
}
