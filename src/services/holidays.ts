
interface PublicHoliday {
  date: string;
  name: string;
  localName: string;
  countryCode: string;
}

// This function will detect public holidays based on the user's region
export async function detectPublicHolidays(year: number): Promise<Array<{ date: string; name: string }>> {
  try {
    // First, let's try to get the user's country
    let countryCode = 'US'; // Default to US
    
    try {
      // Try to get the user's country based on their locale
      const userLocale = navigator.language;
      const regionCode = userLocale.split('-')[1];
      if (regionCode && regionCode.length === 2) {
        countryCode = regionCode;
      }
    } catch (error) {
      console.error('Failed to detect country from locale:', error);
    }
    
    // Fetch holidays for the detected country
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    
    if (!response.ok) {
      // If we fail with the detected country, fall back to US
      if (countryCode !== 'US') {
        const usResponse = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/US`);
        if (!usResponse.ok) {
          throw new Error('Failed to fetch holidays for your region and the fallback region (US)');
        }
        const usHolidays: PublicHoliday[] = await usResponse.json();
        return usHolidays.map(holiday => ({
          date: holiday.date,
          name: holiday.name
        }));
      }
      throw new Error(`Failed to fetch holidays: ${response.statusText}`);
    }
    
    const holidays: PublicHoliday[] = await response.json();
    return holidays.map(holiday => ({
      date: holiday.date,
      name: holiday.name
    }));
  } catch (error) {
    console.error('Error detecting holidays:', error);
    throw new Error('Unable to detect holidays. Please try again or add them manually.');
  }
}
