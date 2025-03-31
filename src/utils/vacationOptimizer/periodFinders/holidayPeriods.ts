
import { addDays, differenceInDays } from 'date-fns';
import { calculateEaster, calculateMidsummer } from '../dateCalculators';
import { calculateVacationDaysNeeded } from '../calculators';

// Find important holiday periods
export const findKeyPeriods = (year: number, holidays: Date[]) => {
  const periods = [];
  
  // Calculate important dates for the specific year
  const easterDate = calculateEaster(year);
  const midsummerDate = calculateMidsummer(year);
  
  // Easter period
  const easterThursday = addDays(easterDate, -3); // Maundy Thursday
  const easterMonday = addDays(easterDate, 1); // Easter Monday
  const extendedEasterStart = addDays(easterThursday, -1); // Day before Maundy Thursday
  const extendedEasterEnd = addDays(easterMonday, 3); // A few days after Easter weekend
  
  const easterPeriod = {
    start: extendedEasterStart,
    end: extendedEasterEnd,
    days: differenceInDays(extendedEasterEnd, extendedEasterStart) + 1,
    vacationDaysNeeded: 7, // Adjust based on holidays and weekends
    description: "Påskledighet",
    score: 85,
    type: "holiday"
  };
  
  // Also create an alternative shorter Easter period
  const shortEasterStart = addDays(easterThursday, -1);
  const shortEasterEnd = addDays(easterMonday, 1);
  
  const shortEasterPeriod = {
    start: shortEasterStart,
    end: shortEasterEnd,
    days: differenceInDays(shortEasterEnd, shortEasterStart) + 1,
    vacationDaysNeeded: 3, // Will be calculated properly later
    description: "Kort påskledighet",
    score: 80,
    type: "holiday"
  };
  
  // Midsummer period
  const midsummerStart = addDays(midsummerDate, -3); // A few days before Midsummer
  const midsummerEnd = addDays(midsummerDate, 5); // A few days after Midsummer
  
  const midsummerPeriod = {
    start: midsummerStart,
    end: midsummerEnd,
    days: differenceInDays(midsummerEnd, midsummerStart) + 1,
    vacationDaysNeeded: 5,
    description: "Midsommarledighet",
    score: 80,
    type: "holiday"
  };
  
  // Create an alternative shorter midsummer period
  const shortMidsummerStart = addDays(midsummerDate, -3);
  const shortMidsummerEnd = addDays(midsummerDate, 2);
  
  const shortMidsummerPeriod = {
    start: shortMidsummerStart,
    end: shortMidsummerEnd,
    days: differenceInDays(shortMidsummerEnd, shortMidsummerStart) + 1,
    vacationDaysNeeded: 3, // Will be calculated properly later
    description: "Kort midsommarledighet",
    score: 75,
    type: "holiday"
  };
  
  // Christmas and New Year - IMPROVED with multiple variations
  // Find the best days to take off around Christmas and New Year

  // 1. Standard Christmas period (Dec 22-31)
  const christmasStart = new Date(year, 11, 22);
  const newYearsEnd = new Date(year + 1, 0, 1);
  
  const christmasPeriod = {
    start: christmasStart,
    end: new Date(year, 11, 31),
    days: differenceInDays(new Date(year, 11, 31), christmasStart) + 1,
    vacationDaysNeeded: 3, // Will be calculated properly later
    description: "Julledighet",
    score: 90,
    type: "holiday"
  };
  
  // 2. Dec 23-Jan 1 (potentially more efficient by using Dec 30)
  const christmasAltStart = new Date(year, 11, 23);
  const christmasAltEnd = new Date(year + 1, 0, 1);
  
  const christmasAltPeriod = {
    start: christmasAltStart,
    end: christmasAltEnd,
    days: differenceInDays(christmasAltEnd, christmasAltStart) + 1,
    vacationDaysNeeded: 3, // Will be calculated properly later
    description: "Julledighet och nyår",
    score: 95,
    type: "holiday"
  };
  
  // 3. Dec 21-Jan 1 (includes weekend before Christmas)
  const extendedChristmasStart = new Date(year, 11, 21);
  const extendedChristmasEnd = new Date(year + 1, 0, 1);
  
  const extendedChristmasPeriod = {
    start: extendedChristmasStart,
    end: extendedChristmasEnd,
    days: differenceInDays(extendedChristmasEnd, extendedChristmasStart) + 1,
    vacationDaysNeeded: 4, // Will be calculated properly later
    description: "Förlängd julledighet med nyår",
    score: 92,
    type: "holiday"
  };
  
  // 4. Dec 20-Jan 1 (if Dec 20 is a Friday, this is even more efficient)
  const longChristmasStart = new Date(year, 11, 20);
  const longChristmasEnd = new Date(year + 1, 0, 1);
  
  const longChristmasPeriod = {
    start: longChristmasStart,
    end: longChristmasEnd,
    days: differenceInDays(longChristmasEnd, longChristmasStart) + 1,
    vacationDaysNeeded: 5, // Will be calculated properly later
    description: "Lång julledighet med nyår",
    score: 88,
    type: "holiday"
  };
  
  // 5. NEW: Add the specifically requested optimal version Dec 19-Dec 31
  const optimalChristmasStart = new Date(year, 11, 19);
  const optimalChristmasEnd = new Date(year, 11, 31); 
  
  const optimalChristmasPeriod = {
    start: optimalChristmasStart,
    end: optimalChristmasEnd, 
    days: differenceInDays(optimalChristmasEnd, optimalChristmasStart) + 1,
    vacationDaysNeeded: 4, // Will be calculated properly later - this includes Dec 30
    description: "Optimal julledighet",
    score: 96, // Highest score for this optimal period
    type: "holiday"
  };
  
  // 6. NEW: A version that extends into early January
  const newYearPeriod = {
    start: new Date(year, 11, 27),
    end: new Date(year + 1, 0, 6), // Through Epiphany
    days: 11,
    vacationDaysNeeded: 5, // Will be calculated properly later
    description: "Nyårsledighet med trettonhelg",
    score: 94,
    type: "holiday"
  };
  
  // NEW: Adding special options for early January (Epiphany is Jan 6)
  const earlyJanuaryStart = new Date(year, 0, 2);
  const earlyJanuaryEnd = new Date(year, 0, 7);
  
  const earlyJanuaryPeriod = {
    start: earlyJanuaryStart,
    end: earlyJanuaryEnd,
    days: differenceInDays(earlyJanuaryEnd, earlyJanuaryStart) + 1,
    vacationDaysNeeded: 3, // Jan 2-3, 7
    description: "Trettondagsledighet",
    score: 85,
    type: "holiday"
  };
  
  // Ascension Day - 40 days after Easter
  const ascensionDay = addDays(easterDate, 39);
  const ascensionStart = addDays(ascensionDay, -1);
  const ascensionEnd = addDays(ascensionDay, 3);
  
  const ascensionPeriod = {
    start: ascensionStart,
    end: ascensionEnd,
    days: differenceInDays(ascensionEnd, ascensionStart) + 1,
    vacationDaysNeeded: 1,
    description: "Kristi himmelsfärdshelg",
    score: 75,
    type: "bridge"
  };
  
  // NEW: Generate efficient alternatives around holidays
  // For each holiday, create efficient short breaks that maximize the days off to vacation days ratio
  const sortedHolidays = [...holidays].sort((a, b) => a.getTime() - b.getTime());
  
  for (const holiday of sortedHolidays) {
    const holidayDayOfWeek = holiday.getDay();
    
    // Skip weekends as they're already off
    if (holidayDayOfWeek === 0 || holidayDayOfWeek === 6) continue;
    
    // Create strategic periods around weekday holidays
    // For Monday holidays: Thursday before to Monday (4 days off, 1-2 vacation days)
    if (holidayDayOfWeek === 1) {
      const thursdayBefore = addDays(holiday, -4);
      const efficientPeriod = {
        start: thursdayBefore,
        end: holiday,
        days: 5,
        vacationDaysNeeded: 2, // Thursday, Friday
        description: `Lång helg med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 78,
        type: "efficient-holiday"
      };
      periods.push(efficientPeriod);
      
      // Also add Friday-Monday option (very efficient)
      const fridayBefore = addDays(holiday, -3);
      const shortEfficientPeriod = {
        start: fridayBefore, 
        end: holiday,
        days: 4,
        vacationDaysNeeded: 1, // Just Friday
        description: `Effektiv långhelg (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 82,
        type: "efficient-holiday"
      };
      periods.push(shortEfficientPeriod);
    }
    
    // For Friday holidays: Friday to Monday after (4 days off, 1 vacation day)
    if (holidayDayOfWeek === 5) {
      const mondayAfter = addDays(holiday, 3);
      const efficientPeriod = {
        start: holiday,
        end: mondayAfter,
        days: 4,
        vacationDaysNeeded: 1, // Just Monday
        description: `Effektiv långhelg (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 82,
        type: "efficient-holiday"
      };
      periods.push(efficientPeriod);
    }
    
    // For Tuesday holidays: Friday before to Tuesday (5 days off, 1 vacation day)
    if (holidayDayOfWeek === 2) {
      const fridayBefore = addDays(holiday, -4);
      const efficientPeriod = {
        start: fridayBefore,
        end: holiday,
        days: 5,
        vacationDaysNeeded: 1, // Just Monday
        description: `Effektiv långhelg (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 85,
        type: "efficient-holiday"
      };
      periods.push(efficientPeriod);
      
      // Also add option from Tuesday to Sunday (6 days off, 3 vacation days)
      const sundayAfter = addDays(holiday, 5);
      const weekExtensionPeriod = {
        start: holiday,
        end: sundayAfter, 
        days: 6,
        vacationDaysNeeded: 3, // Wed, Thu, Fri
        description: `Förlängd vecka med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 77,
        type: "efficient-holiday"
      };
      periods.push(weekExtensionPeriod);
    }
    
    // For Thursday holidays: Thursday to Sunday (4 days off, 1 vacation day)
    if (holidayDayOfWeek === 4) {
      const sundayAfter = addDays(holiday, 3);
      const efficientPeriod = {
        start: holiday,
        end: sundayAfter,
        days: 4,
        vacationDaysNeeded: 1, // Just Friday
        description: `Effektiv långhelg (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 82,
        type: "efficient-holiday"
      };
      periods.push(efficientPeriod);
      
      // Also add Monday to Thursday (4 days off, 3 vacation days)
      const mondayBefore = addDays(holiday, -3);
      const weekStartPeriod = {
        start: mondayBefore,
        end: holiday,
        days: 4,
        vacationDaysNeeded: 3, // Mon, Tue, Wed
        description: `Kort vecka med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 73,
        type: "efficient-holiday"
      };
      periods.push(weekStartPeriod);
    }
    
    // For Wednesday holidays: create both before and after periods
    if (holidayDayOfWeek === 3) {
      // Monday-Wednesday (3 days off, 2 vacation days)
      const mondayBefore = addDays(holiday, -2);
      const firstHalfPeriod = {
        start: mondayBefore,
        end: holiday,
        days: 3,
        vacationDaysNeeded: 2, // Mon, Tue
        description: `Halv vecka med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 75,
        type: "efficient-holiday"
      };
      periods.push(firstHalfPeriod);
      
      // Wednesday-Sunday (5 days off, 2 vacation days)
      const sundayAfter = addDays(holiday, 4);
      const secondHalfPeriod = {
        start: holiday,
        end: sundayAfter,
        days: 5,
        vacationDaysNeeded: 2, // Thu, Fri
        description: `Förlängd helg med röd dag (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 80,
        type: "efficient-holiday"
      };
      periods.push(secondHalfPeriod);
      
      // Friday before to Sunday after (9 days off, 4 vacation days)
      const fridayBefore = addDays(holiday, -5);
      const extendedPeriod = {
        start: fridayBefore,
        end: sundayAfter,
        days: 9,
        vacationDaysNeeded: 4, // Mon, Tue, Thu, Fri
        description: `Effektiv 9-dagarsledighet (${holiday.getDate()}/${holiday.getMonth() + 1})`,
        score: 83,
        type: "efficient-holiday"
      };
      periods.push(extendedPeriod);
    }
  }
  
  // NEW: Generate extended periods for important holiday clusters
  // Find clusters of holidays that are close to each other
  for (let i = 0; i < sortedHolidays.length - 1; i++) {
    const currentHoliday = sortedHolidays[i];
    const nextHoliday = sortedHolidays[i + 1];
    
    // Check if holidays are within 5 days of each other
    const daysBetween = differenceInDays(nextHoliday, currentHoliday);
    
    if (daysBetween > 0 && daysBetween <= 5) {
      // Create an extended period around these close holidays
      const clusterStart = addDays(currentHoliday, -2); // Start 2 days before first holiday
      const clusterEnd = addDays(nextHoliday, 2); // End 2 days after second holiday
      
      const clusterPeriod = {
        start: clusterStart,
        end: clusterEnd,
        days: differenceInDays(clusterEnd, clusterStart) + 1,
        vacationDaysNeeded: 5, // Just an estimate, will be calculated later
        description: "Röda dagar-kluster",
        score: 70,
        type: "holiday-cluster"
      };
      
      periods.push(clusterPeriod);
      
      // Add more efficient alternatives for the cluster
      // Option 1: Friday before first holiday to first holiday
      if (currentHoliday.getDay() > 1) { // If not Monday or Sunday
        const fridayBefore = new Date(currentHoliday);
        while (fridayBefore.getDay() !== 5) {
          fridayBefore.setDate(fridayBefore.getDate() - 1);
        }
        
        if (differenceInDays(currentHoliday, fridayBefore) <= 4) {
          const efficientStartPeriod = {
            start: fridayBefore,
            end: currentHoliday,
            days: differenceInDays(currentHoliday, fridayBefore) + 1,
            vacationDaysNeeded: 2, // Estimate, will be calculated properly later
            description: `Effektiv start till röd dag (${currentHoliday.getDate()}/${currentHoliday.getMonth() + 1})`,
            score: 78,
            type: "efficient-cluster"
          };
          periods.push(efficientStartPeriod);
        }
      }
      
      // Option 2: Last holiday to Sunday after
      if (nextHoliday.getDay() < 6) { // If not Saturday
        const sundayAfter = new Date(nextHoliday);
        while (sundayAfter.getDay() !== 0) {
          sundayAfter.setDate(sundayAfter.getDate() + 1);
        }
        
        if (differenceInDays(sundayAfter, nextHoliday) <= 4) {
          const efficientEndPeriod = {
            start: nextHoliday,
            end: sundayAfter,
            days: differenceInDays(sundayAfter, nextHoliday) + 1,
            vacationDaysNeeded: 2, // Estimate, will be calculated properly later
            description: `Effektivt slut efter röd dag (${nextHoliday.getDate()}/${nextHoliday.getMonth() + 1})`,
            score: 78,
            type: "efficient-cluster"
          };
          periods.push(efficientEndPeriod);
        }
      }
    }
  }
  
  // Add longer periods for holiday seasons
  // Generate some longer holiday periods (10-14 days) that include multiple holidays
  for (let i = 0; i < sortedHolidays.length; i++) {
    const anchorHoliday = sortedHolidays[i];
    
    // Skip Christmas period as we already have it
    if (anchorHoliday.getMonth() === 11 && anchorHoliday.getDate() >= 22) continue;
    
    // Create a 12-day period centered around this holiday
    const longPeriodStart = addDays(anchorHoliday, -6);
    const longPeriodEnd = addDays(anchorHoliday, 5);
    
    // Count how many holidays are in this period
    let holidaysInPeriod = 0;
    for (const holiday of sortedHolidays) {
      if (holiday >= longPeriodStart && holiday <= longPeriodEnd) {
        holidaysInPeriod++;
      }
    }
    
    // Only add periods that include at least 2 holidays
    if (holidaysInPeriod >= 2) {
      const longPeriod = {
        start: longPeriodStart,
        end: longPeriodEnd,
        days: differenceInDays(longPeriodEnd, longPeriodStart) + 1,
        vacationDaysNeeded: 8, // Estimate, will be calculated properly later
        description: "Längre semesterperiod med röda dagar",
        score: 75 + (holidaysInPeriod * 5), // Score based on number of holidays included
        type: "extended-holiday"
      };
      
      periods.push(longPeriod);
    }
  }
  
  periods.push(
    easterPeriod, 
    shortEasterPeriod, 
    midsummerPeriod, 
    shortMidsummerPeriod, 
    christmasPeriod, 
    christmasAltPeriod,
    extendedChristmasPeriod,
    longChristmasPeriod,
    optimalChristmasPeriod,
    newYearPeriod,
    earlyJanuaryPeriod,
    ascensionPeriod
  );
  
  return periods;
};
