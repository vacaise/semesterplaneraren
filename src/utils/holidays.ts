
/**
 * Get Swedish holidays for a specific year
 */
export const getHolidays = (year: number): Date[] => {
  const holidays: Date[] = [];

  // Nyårsdagen - New Year's Day (January 1)
  holidays.push(new Date(year, 0, 1));

  // Get Easter Sunday (which we need to calculate many other holidays)
  const easter = getEasterSunday(year);
  
  // Trettondagen - Epiphany (January 6)
  holidays.push(new Date(year, 0, 6));

  // Långfredagen - Good Friday (Easter - 2 days)
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  holidays.push(goodFriday);

  // Påskdagen - Easter Sunday
  holidays.push(new Date(easter));

  // Annandag påsk - Easter Monday (Easter + 1 day)
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  holidays.push(easterMonday);

  // Första maj - May Day (May 1)
  holidays.push(new Date(year, 4, 1));

  // Kristi Himmelsfärdsdag - Ascension Day (Easter + 39 days, always a Thursday)
  const ascensionDay = new Date(easter);
  ascensionDay.setDate(easter.getDate() + 39);
  holidays.push(ascensionDay);

  // Pingstdagen - Whit Sunday (Easter + 49 days)
  const whitSunday = new Date(easter);
  whitSunday.setDate(easter.getDate() + 49);
  holidays.push(whitSunday);

  // Annandag pingst - removed as public holiday from 2005

  // Sveriges nationaldag - Sweden's National Day (June 6)
  // (This became a public holiday in 2005)
  holidays.push(new Date(year, 5, 6));

  // Midsommardagen - Midsummer's Day (Saturday between June 20-26)
  const midsummerDay = getMidsummerDay(year);
  holidays.push(midsummerDay);

  // Alla helgons dag - All Saints' Day (Saturday between October 31 and November 6)
  const allSaintsDay = getAllSaintsDay(year);
  holidays.push(allSaintsDay);

  // Juldagen - Christmas Day (December 25)
  holidays.push(new Date(year, 11, 25));

  // Annandag jul - Boxing Day (December 26)
  holidays.push(new Date(year, 11, 26));

  // Return sorted holidays
  return holidays.sort((a, b) => a.getTime() - b.getTime());
};

/**
 * Calculate Easter Sunday for a given year
 * Using the Butcher's algorithm
 */
const getEasterSunday = (year: number): Date => {
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
};

/**
 * Get Midsummer's Day for a given year
 * Midsummer's Day is the Saturday that falls between June 20-26
 */
const getMidsummerDay = (year: number): Date => {
  // Start with June 20
  const date = new Date(year, 5, 20);
  
  // Find the next Saturday (day 6)
  while (date.getDay() !== 6) {
    date.setDate(date.getDate() + 1);
  }
  
  return date;
};

/**
 * Get All Saints' Day for a given year
 * All Saints' Day is the Saturday that falls between October 31 and November 6
 */
const getAllSaintsDay = (year: number): Date => {
  // Start with October 31
  const date = new Date(year, 9, 31);
  
  // Find the next Saturday (day 6)
  while (date.getDay() !== 6) {
    date.setDate(date.getDate() + 1);
  }
  
  return date;
};
