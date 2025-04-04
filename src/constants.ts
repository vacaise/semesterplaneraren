
import { OptimizationStrategy } from './types';

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
