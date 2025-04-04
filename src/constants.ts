
import { OptimizationStrategy } from './types';
import { ColorSchemes } from './types';

export const PROJECT_NAME = "PTO Optimizer";
export const GITHUB_URL = "https://github.com/waqarkalim/holiday-optimizer";
export const UMAMI_WEBSITE_ID = "your-umami-website-id"; // Replace with actual ID when available

export const OPTIMIZATION_STRATEGIES = [
  {
    id: 'balanced' as OptimizationStrategy,
    label: 'Balanced Breaks',
    description: 'Mix of short weekends and longer vacation periods spread throughout the year.',
  },
  {
    id: 'longWeekends' as OptimizationStrategy,
    label: 'Long Weekends',
    description: 'Maximize the number of 3-4 day weekends throughout the year.',
  },
  {
    id: 'miniBreaks' as OptimizationStrategy,
    label: 'Mini Breaks',
    description: 'Create 5-6 day breaks, perfect for short trips without using too many days at once.',
  },
  {
    id: 'weekLongBreaks' as OptimizationStrategy,
    label: 'Week-long Breaks',
    description: 'Focus on creating 7-9 day vacation periods, ideal for longer trips.',
  },
  {
    id: 'extendedVacations' as OptimizationStrategy,
    label: 'Extended Vacations',
    description: 'Concentrate days into fewer, longer 10-15 day vacation periods for substantial trips.',
  },
];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Define color schemes for use throughout the app
export const COLOR_SCHEMES: ColorSchemes = {
  teal: {
    icon: {
      primary: "text-teal-600 dark:text-teal-400",
      secondary: "text-teal-500 dark:text-teal-300"
    },
    tooltip: {
      background: "bg-teal-50 dark:bg-teal-900/50",
      border: "border-teal-200 dark:border-teal-800",
      text: "text-teal-900 dark:text-teal-100"
    },
    card: {
      hover: "hover:border-teal-300 dark:hover:border-teal-700",
      ring: "ring-teal-400 dark:ring-teal-500"
    },
    calendar: {
      selected: "bg-teal-100 dark:bg-teal-800",
      hover: "hover:bg-teal-50 dark:hover:bg-teal-900/50"
    }
  },
  blue: {
    icon: {
      primary: "text-blue-600 dark:text-blue-400",
      secondary: "text-blue-500 dark:text-blue-300"
    },
    tooltip: {
      background: "bg-blue-50 dark:bg-blue-900/50",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-900 dark:text-blue-100"
    },
    card: {
      hover: "hover:border-blue-300 dark:hover:border-blue-700",
      ring: "ring-blue-400 dark:ring-blue-500"
    },
    calendar: {
      selected: "bg-blue-100 dark:bg-blue-800",
      hover: "hover:bg-blue-50 dark:hover:bg-blue-900/50"
    }
  },
  amber: {
    icon: {
      primary: "text-amber-600 dark:text-amber-400",
      secondary: "text-amber-500 dark:text-amber-300"
    },
    tooltip: {
      background: "bg-amber-50 dark:bg-amber-900/50",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-900 dark:text-amber-100"
    },
    card: {
      hover: "hover:border-amber-300 dark:hover:border-amber-700",
      ring: "ring-amber-400 dark:ring-amber-500"
    },
    calendar: {
      selected: "bg-amber-100 dark:bg-amber-800",
      hover: "hover:bg-amber-50 dark:hover:bg-amber-900/50"
    }
  },
  violet: {
    icon: {
      primary: "text-violet-600 dark:text-violet-400",
      secondary: "text-violet-500 dark:text-violet-300"
    },
    tooltip: {
      background: "bg-violet-50 dark:bg-violet-900/50",
      border: "border-violet-200 dark:border-violet-800",
      text: "text-violet-900 dark:text-violet-100"
    },
    card: {
      hover: "hover:border-violet-300 dark:hover:border-violet-700",
      ring: "ring-violet-400 dark:ring-violet-500"
    },
    calendar: {
      selected: "bg-violet-100 dark:bg-violet-800",
      hover: "hover:bg-violet-50 dark:hover:bg-violet-900/50"
    }
  }
};
