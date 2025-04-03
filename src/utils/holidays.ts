
interface LocalityInfoItem {
  name: string;
  description?: string;
  isoName?: string;
  order: number;
  adminLevel?: number;
  isoCode?: string;
  wikidataId?: string;
  geonameId?: number;
}

interface LocalityInfo {
  administrative: LocalityInfoItem[];
  informative: LocalityInfoItem[];
}

interface GeoLocationResponse {
  latitude: number;
  lookupSource: string;
  longitude: number;
  localityLanguageRequested: string;
  continent: string;
  continentCode: string;
  countryName: string;
  countryCode: string;
  principalSubdivision: string;
  principalSubdivisionCode: string;
  city: string;
  locality: string;
  postcode: string;
  plusCode: string;
  csdCode: string;
  localityInfo: LocalityInfo;
}

interface HolidayResponse {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export interface DetectedHoliday {
  date: string;
  name: string;
}

const getCountryFromCoordinates = async (latitude: number, longitude: number): Promise<GeoLocationResponse> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );
    return await response.json();
  } catch (error) {
    console.error('Error getting country from coordinates:', error);
    throw new Error('Failed to detect country from location');
  }
};

export const detectPublicHolidays = async (year?: number): Promise<DetectedHoliday[]> => {
  try {
    // Get user's location
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    // Get country code from coordinates
    const { countryCode, principalSubdivisionCode } = await getCountryFromCoordinates(
      position.coords.latitude,
      position.coords.longitude,
    );

    // Use provided year or default to current year
    const targetYear = year || new Date().getUTCFullYear();

    // Fetch holidays from Nager.Date API
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${targetYear}/${countryCode}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch holidays');
    }

    const holidays: HolidayResponse[] = await response.json();

    const filteredHolidays = holidays.filter((holiday) => holiday.global || holiday.counties?.includes(principalSubdivisionCode));

    // Transform the response to match our app's format
    return filteredHolidays.map(holiday => ({
      date: holiday.date,
      name: holiday.localName || holiday.name,
    }));
  } catch (error) {
    console.error('Error detecting public holidays:', error);
    throw error;
  }
};

// Backward compatibility function for the current app structure
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

  // Calculate Easter and related holidays
  const easterSunday = calculateEaster(year);
  const easterFriday = new Date(easterSunday);
  easterFriday.setDate(easterSunday.getDate() - 2);
  
  const easterMonday = new Date(easterSunday);
  easterMonday.setDate(easterSunday.getDate() + 1);
  
  const ascensionDay = new Date(easterSunday);
  ascensionDay.setDate(easterSunday.getDate() + 39);
  
  const pentecostSunday = new Date(easterSunday);
  pentecostSunday.setDate(easterSunday.getDate() + 49);
  
  // Midsommar (lördag efter 20 juni)
  const midsummerDay = new Date(year, 5, 20);
  const dayOfWeek = midsummerDay.getDay();
  const daysToAdd = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
  midsummerDay.setDate(midsummerDay.getDate() + daysToAdd);
  
  // Midsommarafton
  const midsummerEve = new Date(midsummerDay);
  midsummerEve.setDate(midsummerDay.getDate() - 1);
  
  // Alla helgons dag
  const allSaintsDay = new Date(year, 9, 31);
  const allSaintsDayOfWeek = allSaintsDay.getDay();
  const allSaintsDaysToAdd = allSaintsDayOfWeek === 6 ? 7 : 6 - allSaintsDayOfWeek;
  allSaintsDay.setDate(allSaintsDay.getDate() + allSaintsDaysToAdd);

  // Combine all holidays
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
  return holidays.filter(holiday => {
    const holidayDate = new Date(holiday.getFullYear(), holiday.getMonth(), holiday.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return !isPast(holidayDate) || holidayDate.getTime() === todayDate.getTime();
  });
};

// Helper function for Easter calculation - kept for backward compatibility
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

// Helper for date comparison
const isPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};
