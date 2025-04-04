
import { useEffect } from 'react';
import { useOptimizer } from '../contexts/OptimizerContext';

// Keys for localStorage
const STORAGE_KEYS = {
  DAYS: 'holiday-optimizer-days',
  STRATEGY: 'holiday-optimizer-strategy',
  COMPANY_DAYS: 'holiday-optimizer-company-days',
  HOLIDAYS: 'holiday-optimizer-holidays',
  SELECTED_YEAR: 'holiday-optimizer-selected-year',
};

export function useLocalStorage() {
  const { state, dispatch } = useOptimizer();

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedDays = localStorage.getItem(STORAGE_KEYS.DAYS);
      if (savedDays) {
        dispatch({ type: 'SET_DAYS', payload: savedDays });
      }

      const savedStrategy = localStorage.getItem(STORAGE_KEYS.STRATEGY);
      if (savedStrategy) {
        dispatch({ type: 'SET_STRATEGY', payload: savedStrategy as any });
      }

      const savedCompanyDays = localStorage.getItem(STORAGE_KEYS.COMPANY_DAYS);
      if (savedCompanyDays) {
        dispatch({ type: 'SET_COMPANY_DAYS', payload: JSON.parse(savedCompanyDays) });
      }

      const savedHolidays = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
      if (savedHolidays) {
        dispatch({ type: 'SET_HOLIDAYS', payload: JSON.parse(savedHolidays) });
      }

      const savedYear = localStorage.getItem(STORAGE_KEYS.SELECTED_YEAR);
      if (savedYear) {
        dispatch({ type: 'SET_YEAR', payload: parseInt(savedYear, 10) });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, [dispatch]);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAYS, state.days);
      localStorage.setItem(STORAGE_KEYS.STRATEGY, state.strategy);
      localStorage.setItem(STORAGE_KEYS.COMPANY_DAYS, JSON.stringify(state.companyDaysOff));
      localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(state.holidays));
      localStorage.setItem(STORAGE_KEYS.SELECTED_YEAR, state.selectedYear.toString());
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state]);

  return null;
}
