
// Functions for special date calculations

// Calculate Easter date for a given year using the Meeus/Jones/Butcher algorithm
export const calculateEaster = (year: number) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-based month
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month, day);
};

// Calculate Midsummer for a given year (Friday between June 19-25)
export const calculateMidsummer = (year: number) => {
  // Midsummer is always a Friday between 19 and 25 June
  const june19 = new Date(year, 5, 19);
  const day = june19.getDay();
  const daysToAdd = day === 5 ? 0 : (5 - day + 7) % 7;
  return new Date(june19.getFullYear(), june19.getMonth(), june19.getDate() + daysToAdd);
};
