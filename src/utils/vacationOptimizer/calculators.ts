
// Calculate the efficiency of a vacation plan
export function calculateEfficiency(totalDaysOff: number, vacationDaysUsed: number): string {
  if (vacationDaysUsed <= 0) return "0";
  const efficiency = totalDaysOff / vacationDaysUsed;
  return efficiency.toFixed(2);
}

// Calculate how many vacation days are needed for a period
export function calculateVacationDaysNeeded(
  startDate: Date, 
  endDate: Date, 
  holidays: Date[]
): number {
  let vacationDaysNeeded = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (isWorkday(currentDate, holidays)) {
      vacationDaysNeeded++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return vacationDaysNeeded;
}

// Check if a date is a workday (not weekend and not holiday)
function isWorkday(date: Date, holidays: Date[]): boolean {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false; // Weekend
  }
  
  // Check if it's a holiday
  for (const holiday of holidays) {
    if (holiday.getFullYear() === date.getFullYear() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getDate() === date.getDate()) {
      return false;
    }
  }
  
  return true;
}
