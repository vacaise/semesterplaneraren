
import { useOptimizer } from '@/contexts/OptimizerContext';
import { useCallback } from 'react';
import { CompanyDayOff, OptimizationStrategy } from '@/types';

export function useDaysInput() {
  const { state, dispatch } = useOptimizer();
  
  const setDays = useCallback((days: string) => {
    dispatch({ type: 'SET_DAYS', payload: days });
  }, [dispatch]);
  
  return {
    days: state.days,
    errors: state.errors?.days,
    setDays,
  };
}

export function useStrategySelection() {
  const { state, dispatch } = useOptimizer();
  
  const setStrategy = useCallback((strategy: OptimizationStrategy) => {
    dispatch({ type: 'SET_STRATEGY', payload: strategy });
  }, [dispatch]);
  
  return {
    strategy: state.strategy,
    setStrategy,
  };
}

export function useHolidays() {
  const { state, dispatch } = useOptimizer();
  
  const addHoliday = useCallback((date: string, name: string) => {
    dispatch({ 
      type: 'ADD_HOLIDAY', 
      payload: { date, name } 
    });
  }, [dispatch]);
  
  const removeHoliday = useCallback((date: string) => {
    dispatch({ 
      type: 'REMOVE_HOLIDAY', 
      payload: date 
    });
  }, [dispatch]);
  
  const clearHolidays = useCallback(() => {
    dispatch({ type: 'CLEAR_HOLIDAYS' });
  }, [dispatch]);
  
  const setDetectedHolidays = useCallback((holidays: Array<{ date: string; name: string }>) => {
    dispatch({ type: 'SET_DETECTED_HOLIDAYS', payload: holidays });
  }, [dispatch]);
  
  return {
    holidays: state.holidays,
    addHoliday,
    removeHoliday,
    clearHolidays,
    setDetectedHolidays,
  };
}

export function useCompanyDays() {
  const { state, dispatch } = useOptimizer();
  
  const addCompanyDay = useCallback((date: string, name: string) => {
    dispatch({ 
      type: 'ADD_COMPANY_DAY', 
      payload: { date, name } as CompanyDayOff
    });
  }, [dispatch]);
  
  const removeCompanyDay = useCallback((date: string) => {
    dispatch({ 
      type: 'REMOVE_COMPANY_DAY', 
      payload: date 
    });
  }, [dispatch]);
  
  const clearCompanyDays = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPANY_DAYS' });
  }, [dispatch]);
  
  return {
    companyDaysOff: state.companyDaysOff,
    addCompanyDay,
    removeCompanyDay,
    clearCompanyDays,
  };
}

export function useYearSelection() {
  const { state, dispatch } = useOptimizer();
  
  const setSelectedYear = useCallback((year: number) => {
    dispatch({ type: 'SET_SELECTED_YEAR', payload: year });
  }, [dispatch]);
  
  return {
    selectedYear: state.selectedYear,
    setSelectedYear,
  };
}
