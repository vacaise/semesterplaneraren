
// Umami Analytics Configuration
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '';

// Project Information
export const PROJECT_NAME = 'Holiday Optimizer';
export const GITHUB_URL = 'https://github.com/waqarkalim/holiday-optimizer';

// Calendar Constants
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Optimization Strategy Constants
export const OPTIMIZATION_STRATEGIES = [
  {
    id: 'balanced',
    label: 'Balanced Mix',
    description: 'Combines short and long breaks throughout the year for variety.'
  },
  {
    id: 'miniBreaks',
    label: 'Frequent Mini-Breaks',
    description: 'Prioritizes more frequent short breaks throughout the year.'
  },
  {
    id: 'longWeekends',
    label: 'Long Weekends',
    description: 'Extends weekends by taking Fridays or Mondays off.'
  },
  {
    id: 'weekLongBreaks',
    label: 'Week-Long Breaks',
    description: 'Creates 5-7 day breaks a few times throughout the year.'
  },
  {
    id: 'extendedVacations',
    label: 'Extended Vacations',
    description: 'Consolidates time off for 1-2 longer vacations.'
  }
];

// Break Length Definitions
export const BREAK_LENGTHS = {
  LONG_WEEKEND: { MIN: 3, MAX: 4 },
  MINI_BREAK: { MIN: 5, MAX: 6 },
  WEEK_LONG: { MIN: 7, MAX: 13 },
  EXTENDED: { MIN: 14, MAX: 31 }
};

// Color Schemes for different day types
export const COLOR_SCHEMES = {
  primary: {
    icon: {
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      text: 'text-blue-700 dark:text-blue-300',
      ring: 'ring-blue-100 dark:ring-blue-900/40'
    },
    calendar: {
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      text: 'text-blue-700 dark:text-blue-300'
    }
  },
  secondary: {
    icon: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      ring: 'ring-gray-100 dark:ring-gray-800'
    },
    calendar: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300'
    }
  },
  success: {
    icon: {
      bg: 'bg-green-100 dark:bg-green-900/40',
      text: 'text-green-700 dark:text-green-300',
      ring: 'ring-green-100 dark:ring-green-900/40'
    },
    calendar: {
      bg: 'bg-green-100 dark:bg-green-900/40',
      text: 'text-green-700 dark:text-green-300'
    }
  },
  warning: {
    icon: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/40',
      text: 'text-yellow-700 dark:text-yellow-300',
      ring: 'ring-yellow-100 dark:ring-yellow-900/40'
    },
    calendar: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/40',
      text: 'text-yellow-700 dark:text-yellow-300'
    }
  },
  danger: {
    icon: {
      bg: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-700 dark:text-red-300',
      ring: 'ring-red-100 dark:ring-red-900/40'
    },
    calendar: {
      bg: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-700 dark:text-red-300'
    }
  },
  info: {
    icon: {
      bg: 'bg-cyan-100 dark:bg-cyan-900/40',
      text: 'text-cyan-700 dark:text-cyan-300',
      ring: 'ring-cyan-100 dark:ring-cyan-900/40'
    },
    calendar: {
      bg: 'bg-cyan-100 dark:bg-cyan-900/40',
      text: 'text-cyan-700 dark:text-cyan-300'
    }
  },
  purple: {
    icon: {
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      text: 'text-purple-700 dark:text-purple-300',
      ring: 'ring-purple-100 dark:ring-purple-900/40'
    },
    calendar: {
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      text: 'text-purple-700 dark:text-purple-300'
    }
  },
  orange: {
    icon: {
      bg: 'bg-orange-100 dark:bg-orange-900/40',
      text: 'text-orange-700 dark:text-orange-300',
      ring: 'ring-orange-100 dark:ring-orange-900/40'
    },
    calendar: {
      bg: 'bg-orange-100 dark:bg-orange-900/40',
      text: 'text-orange-700 dark:text-orange-300'
    }
  },
  indigo: {
    icon: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/40',
      text: 'text-indigo-700 dark:text-indigo-300',
      ring: 'ring-indigo-100 dark:ring-indigo-900/40'
    },
    calendar: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/40',
      text: 'text-indigo-700 dark:text-indigo-300'
    }
  },
  // Day type specific color schemes
  pto: {
    icon: {
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      text: 'text-blue-700 dark:text-blue-300',
      ring: 'ring-blue-100 dark:ring-blue-900/40'
    },
    calendar: {
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      text: 'text-blue-700 dark:text-blue-300'
    }
  },
  publicHoliday: {
    icon: {
      bg: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-700 dark:text-red-300',
      ring: 'ring-red-100 dark:ring-red-900/40'
    },
    calendar: {
      bg: 'bg-red-100 dark:bg-red-900/40',
      text: 'text-red-700 dark:text-red-300'
    }
  },
  companyDayOff: {
    icon: {
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      text: 'text-purple-700 dark:text-purple-300',
      ring: 'ring-purple-100 dark:ring-purple-900/40'
    },
    calendar: {
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      text: 'text-purple-700 dark:text-purple-300'
    }
  },
  weekend: {
    icon: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      ring: 'ring-gray-100 dark:ring-gray-800'
    },
    calendar: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300'
    }
  },
  default: {
    icon: {
      bg: 'bg-white dark:bg-gray-950',
      text: 'text-gray-500 dark:text-gray-400',
      ring: 'ring-gray-200 dark:ring-gray-700'
    },
    calendar: {
      bg: 'bg-white dark:bg-gray-950',
      text: 'text-gray-500 dark:text-gray-400'
    }
  },
  past: {
    icon: {
      bg: 'bg-gray-50 dark:bg-gray-900',
      text: 'text-gray-400 dark:text-gray-600',
      ring: 'ring-gray-100 dark:ring-gray-800'
    },
    calendar: {
      bg: 'bg-gray-50 dark:bg-gray-900',
      text: 'text-gray-400 dark:text-gray-600'
    }
  },
  today: {
    icon: {
      bg: 'bg-blue-500/20 dark:bg-blue-400/20',
      text: 'text-blue-700 dark:text-blue-300',
      ring: 'ring-blue-200 dark:ring-blue-700'
    },
    calendar: {
      bg: 'bg-blue-500/20 dark:bg-blue-400/20',
      text: 'text-blue-700 dark:text-blue-300'
    }
  },
  extendedWeekend: {
    icon: {
      bg: 'bg-purple-100/80 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300',
      ring: 'ring-purple-200 dark:ring-purple-800/50'
    },
    calendar: {
      bg: 'bg-purple-100/80 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300'
    }
  }
};
