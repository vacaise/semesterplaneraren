
import { useOptimizer } from '../contexts/OptimizerContext';
import { OptimizationStrategy } from '../types';

// Hook for managing days input
export function useDaysInput() {
  const { state, dispatch } = useOptimizer();
  const { days } = state;

  const setDays = (value: string) => {
    const numValue = value === '' ? '' : value;
    dispatch({ type: 'SET_DAYS', payload: numValue });
  };

  // Validate days input
  const validateDays = (value: string): string | null => {
    if (!value) return 'Please enter the number of days';
    const numDays = Number(value);
    if (isNaN(numDays)) return 'Please enter a valid number';
    if (numDays <= 0) return 'Number of days must be greater than 0';
    if (numDays > 365) return 'Number of days cannot exceed 365';
    return null;
  };

  const errors = validateDays(days);

  return { days, setDays, errors };
}

// Hook for managing strategy selection
export function useStrategySelection() {
  const { state, dispatch } = useOptimizer();
  const { strategy } = state;

  const setStrategy = (value: OptimizationStrategy) => {
    dispatch({ type: 'SET_STRATEGY', payload: value });
  };

  return { strategy, setStrategy };
}

// Hook for managing holidays
export function useHolidays() {
  const { state, dispatch } = useOptimizer();
  const { holidays } = state;

  const addHoliday = (date: string, name: string) => {
    dispatch({ type: 'ADD_HOLIDAY', payload: { date, name } });
  };

  const removeHoliday = (date: string) => {
    dispatch({ type: 'REMOVE_HOLIDAY', payload: date });
  };

  const setHolidays = (holidays: Array<{ date: string; name: string }>) => {
    dispatch({ type: 'SET_HOLIDAYS', payload: holidays });
  };

  const setDetectedHolidays = (holidays: Array<{ date: string; name: string }>) => {
    // Combine existing custom holidays with detected ones
    const existingCustomHolidays = state.holidays.filter(
      holiday => !holidays.some(h => h.date === holiday.date)
    );
    setHolidays([...existingCustomHolidays, ...holidays]);
  };

  return { holidays, addHoliday, removeHoliday, setHolidays, setDetectedHolidays };
}

// Hook for managing company days off
export function useCompanyDays() {
  const { state, dispatch } = useOptimizer();
  const { companyDaysOff } = state;

  const addCompanyDay = (date: string, name: string) => {
    dispatch({ type: 'ADD_COMPANY_DAY', payload: { date, name } });
  };

  const removeCompanyDay = (date: string) => {
    dispatch({ type: 'REMOVE_COMPANY_DAY', payload: date });
  };

  const setCompanyDays = (days: Array<{ date: string; name: string }>) => {
    dispatch({ type: 'SET_COMPANY_DAYS', payload: days });
  };

  return { companyDaysOff, addCompanyDay, removeCompanyDay, setCompanyDays };
}

// Hook for managing year selection
export function useYearSelection() {
  const { state, dispatch } = useOptimizer();
  const { selectedYear } = state;

  const setSelectedYear = (year: number) => {
    dispatch({ type: 'SET_YEAR', payload: year });
  };

  return { selectedYear, setSelectedYear };
}
