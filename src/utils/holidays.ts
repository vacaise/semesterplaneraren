
import { parse, format, isPast } from "date-fns";

// Funktion för att beräkna påskdagen baserat på år
const calculateEaster = (year: number): Date => {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

export const getHolidays = (year: number): Date[] => {
  // Fasta helgdagar
  const fixedHolidays = [
    { month: 0, day: 1, name: "Nyårsdagen" },
    { month: 0, day: 6, name: "Trettondedag jul" },
    { month: 4, day: 1, name: "Första maj" },
    { month: 5, day: 6, name: "Sveriges nationaldag" },
    { month: 11, day: 24, name: "Julafton" },
    { month: 11, day: 25, name: "Juldagen" },
    { month: 11, day: 26, name: "Annandag jul" },
    { month: 11, day: 31, name: "Nyårsafton" },
  ];

  // Rörliga helgdagar baserade på påsk
  const easterSunday = calculateEaster(year);
  const easterFriday = new Date(easterSunday);
  easterFriday.setDate(easterSunday.getDate() - 2);
  
  const easterMonday = new Date(easterSunday);
  easterMonday.setDate(easterSunday.getDate() + 1);
  
  const ascensionDay = new Date(easterSunday);
  ascensionDay.setDate(easterSunday.getDate() + 39);
  
  const pentecostSunday = new Date(easterSunday);
  pentecostSunday.setDate(easterSunday.getDate() + 49);
  
  // Midsommardagen (lördag efter 20 juni)
  const midsummerDay = new Date(year, 5, 20);
  // Justera till nästa lördag
  const dayOfWeek = midsummerDay.getDay();
  const daysToAdd = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
  midsummerDay.setDate(midsummerDay.getDate() + daysToAdd);
  
  // Midsommarafton (fredag före midsommardagen)
  const midsummerEve = new Date(midsummerDay);
  midsummerEve.setDate(midsummerDay.getDate() - 1);
  
  // Alla helgons dag (lördag mellan 31 oktober och 6 november)
  const allSaintsDay = new Date(year, 9, 31);
  // Justera till nästa lördag
  const allSaintsDayOfWeek = allSaintsDay.getDay();
  const allSaintsDaysToAdd = allSaintsDayOfWeek === 6 ? 7 : 6 - allSaintsDayOfWeek;
  allSaintsDay.setDate(allSaintsDay.getDate() + allSaintsDaysToAdd);

  // Skapa en lista med alla helgdagar
  const holidays = [
    ...fixedHolidays.map(holiday => new Date(year, holiday.month, holiday.day)),
    easterFriday,
    easterSunday,
    easterMonday,
    ascensionDay,
    pentecostSunday,
    midsummerEve,
    midsummerDay,
    allSaintsDay
  ];

  // Filter out holidays that have already passed
  const today = new Date();
  return holidays.filter(holiday => !isPast(holiday));
};
