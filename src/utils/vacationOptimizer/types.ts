
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

// Added a simple mock scheduler that can be used for testing
export const mockSchedule = (year: number, days: number): OptimizedSchedule => {
  return {
    totalDaysOff: days * 2,
    vacationDaysUsed: days,
    mode: "balanced",
    periods: [
      {
        start: new Date(year, 5, 15),  // June 15
        end: new Date(year, 5, 20),    // June 20
        days: 6,
        vacationDaysNeeded: 4,
        description: "Midsommarsemester",
        type: "summer"
      },
      {
        start: new Date(year, 11, 27), // December 27
        end: new Date(year, 11, 31),   // December 31
        days: 5,
        vacationDaysNeeded: days - 4,
        description: "Nyårssemester",
        type: "holiday"
      }
    ]
  };
};
