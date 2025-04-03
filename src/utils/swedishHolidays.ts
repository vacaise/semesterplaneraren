
import { addDays, format } from 'date-fns';
import { sv } from 'date-fns/locale';

// Types for Swedish holidays
export interface SwedishHoliday {
  date: Date;
  name: string;
  type: 'fixed' | 'variable' | 'observance';
}

// Calculate Easter Sunday for a given year (using Meeus/Jones/Butcher algorithm)
export function calculateEasterSunday(year: number): Date {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month, day);
}

// Calculate Midsummer Eve (Friday between June 19-25)
export function calculateMidsummerEve(year: number): Date {
  // Midsummer Eve is always a Friday between June 19-25
  const june19 = new Date(year, 5, 19);
  const dayOfWeek = june19.getDay();
  const daysToAdd = dayOfWeek <= 5 ? 5 - dayOfWeek : 12 - dayOfWeek;
  return new Date(year, 5, 19 + daysToAdd);
}

// Calculate All Saints' Day (Saturday between Oct 31 and Nov 6)
export function calculateAllSaintsDay(year: number): Date {
  // All Saints' Day is the Saturday between Oct 31 and Nov 6
  const oct31 = new Date(year, 9, 31);
  const dayOfWeek = oct31.getDay();
  const daysToAdd = dayOfWeek <= 6 ? 6 - dayOfWeek : 13 - dayOfWeek;
  return new Date(year, 9, 31 + daysToAdd);
}

// Get all Swedish holidays for a given year
export function getSwedishHolidays(year: number): SwedishHoliday[] {
  // Calculate Easter dates
  const easterSunday = calculateEasterSunday(year);
  const goodFriday = addDays(easterSunday, -2);
  const easterMonday = addDays(easterSunday, 1);
  const ascensionDay = addDays(easterSunday, 39); // 39 days after Easter
  const pentecostSunday = addDays(easterSunday, 49); // 49 days after Easter
  
  // Calculate other variable dates
  const midsummerEve = calculateMidsummerEve(year);
  const midsummerDay = addDays(midsummerEve, 1);
  const allSaintsDay = calculateAllSaintsDay(year);
  
  // Define all Swedish holidays
  const holidays: SwedishHoliday[] = [
    // Fixed holidays
    { date: new Date(year, 0, 1), name: 'Nyårsdagen', type: 'fixed' },
    { date: new Date(year, 0, 6), name: 'Trettondedag jul', type: 'fixed' },
    { date: new Date(year, 4, 1), name: 'Första maj', type: 'fixed' },
    { date: new Date(year, 5, 6), name: 'Sveriges nationaldag', type: 'fixed' },
    { date: new Date(year, 11, 24), name: 'Julafton', type: 'observance' },
    { date: new Date(year, 11, 25), name: 'Juldagen', type: 'fixed' },
    { date: new Date(year, 11, 26), name: 'Annandag jul', type: 'fixed' },
    { date: new Date(year, 11, 31), name: 'Nyårsafton', type: 'observance' },
    
    // Variable holidays
    { date: goodFriday, name: 'Långfredagen', type: 'variable' },
    { date: easterSunday, name: 'Påskdagen', type: 'variable' },
    { date: easterMonday, name: 'Annandag påsk', type: 'variable' },
    { date: ascensionDay, name: 'Kristi himmelsfärdsdag', type: 'variable' },
    { date: pentecostSunday, name: 'Pingstdagen', type: 'variable' },
    { date: midsummerEve, name: 'Midsommarafton', type: 'observance' },
    { date: midsummerDay, name: 'Midsommardagen', type: 'variable' },
    { date: allSaintsDay, name: 'Alla helgons dag', type: 'variable' }
  ];
  
  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Format date as Swedish string
export function formatSwedishDate(date: Date): string {
  return format(date, 'd MMMM yyyy', { locale: sv });
}

// Check if a date is a Swedish holiday
export function isSwedishHoliday(date: Date, holidays: SwedishHoliday[]): boolean {
  return holidays.some(holiday => 
    holiday.date.getFullYear() === date.getFullYear() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getDate() === date.getDate()
  );
}

// Check if a date is a weekend (Saturday or Sunday)
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

// Check if a date is a day off (weekend or holiday)
export function isDayOff(date: Date, holidays: SwedishHoliday[]): boolean {
  return isWeekend(date) || isSwedishHoliday(date, holidays);
}

// Get month name in Swedish
export function getSwedishMonthName(month: number): string {
  const monthNames = [
    'januari', 'februari', 'mars', 'april', 'maj', 'juni',
    'juli', 'augusti', 'september', 'oktober', 'november', 'december'
  ];
  return monthNames[month];
}
