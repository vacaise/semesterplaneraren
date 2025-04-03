
// Calculate efficiency (days off / vacation days used)
export const calculateEfficiency = (totalDaysOff, vacationDaysUsed) => {
  if (vacationDaysUsed <= 0) return "0.00";
  
  const efficiency = totalDaysOff / vacationDaysUsed;
  return efficiency.toFixed(2);
};
