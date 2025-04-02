
import { addDays } from 'date-fns';

// Calculate Easter Sunday based on Butcher's algorithm
export const calculateEaster = (year: number): Date => {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed month
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month, day);
};

// Get all Swedish holidays for a given year
export const getSwedishHolidays = (year: number): Date[] => {
  const holidays: Date[] = [];
  
  // Fixed holidays
  holidays.push(new Date(year, 0, 1));  // Nyårsdagen
  holidays.push(new Date(year, 0, 6));  // Trettondedag jul
  holidays.push(new Date(year, 4, 1));  // Första maj
  holidays.push(new Date(year, 5, 6));  // Sveriges nationaldag
  holidays.push(new Date(year, 11, 24)); // Julafton
  holidays.push(new Date(year, 11, 25)); // Juldagen
  holidays.push(new Date(year, 11, 26)); // Annandag jul
  holidays.push(new Date(year, 11, 31)); // Nyårsafton
  
  // Movable holidays based on Easter
  const easter = calculateEaster(year);
  
  // Långfredagen (Good Friday) - 2 days before Easter
  holidays.push(addDays(easter, -2));
  
  // Påskdagen (Easter Sunday)
  holidays.push(easter);
  
  // Annandag påsk (Easter Monday)
  holidays.push(addDays(easter, 1));
  
  // Kristi himmelsfärdsdag (Ascension Day) - 39 days after Easter
  holidays.push(addDays(easter, 39));
  
  // Pingstdagen (Pentecost) - 49 days after Easter
  holidays.push(addDays(easter, 49));
  
  // Midsommardagen (Saturday between June 20-26)
  const midsummerDay = new Date(year, 5, 20);
  const dayOfWeek = midsummerDay.getDay();
  const daysToAdd = (dayOfWeek === 6) ? 0 : ((6 - dayOfWeek + 7) % 7);
  holidays.push(addDays(midsummerDay, daysToAdd));
  
  // Midsommarafton (Friday before Midsummer)
  holidays.push(addDays(midsummerDay, daysToAdd - 1));
  
  // Alla helgons dag (All Saints' Day) - First Saturday in November
  const allSaintsDay = new Date(year, 10, 1);
  const allSaintsDayOfWeek = allSaintsDay.getDay();
  const allSaintsDaysToAdd = (allSaintsDayOfWeek === 6) ? 0 : ((6 - allSaintsDayOfWeek + 7) % 7);
  holidays.push(addDays(allSaintsDay, allSaintsDaysToAdd));
  
  // Filter out past dates if we're in the current year
  const currentYear = new Date().getFullYear();
  const today = new Date();
  
  if (year === currentYear) {
    return holidays.filter(date => date >= today);
  }
  
  return holidays;
};

// Create an alias for getSwedishHolidays to match the reference in Index.tsx
export const getHolidays = getSwedishHolidays;
