
import { SwedishHoliday, getSwedishHolidays } from './swedishHolidays';

// Function to get all public holidays for a given year
export function getHolidays(year: number): SwedishHoliday[] {
  return getSwedishHolidays(year);
}
