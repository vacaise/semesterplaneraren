
// Add this file to provide the missing functionality for company days

import { useOptimizer } from '@/contexts/OptimizerContext';
import { CompanyDayOff } from '@/types';

export function useCompanyDays() {
  const { state, dispatch } = useOptimizer();

  const addCompanyDay = (date: string, name: string) => {
    dispatch({ 
      type: 'ADD_COMPANY_DAY', 
      payload: { date, name } 
    });
  };

  const removeCompanyDay = (date: string) => {
    dispatch({ 
      type: 'REMOVE_COMPANY_DAY', 
      payload: date 
    });
  };

  const setCompanyDays = (days: CompanyDayOff[]) => {
    dispatch({ 
      type: 'SET_COMPANY_DAYS', 
      payload: days 
    });
  };

  const clearCompanyDays = () => {
    dispatch({ 
      type: 'SET_COMPANY_DAYS', 
      payload: [] 
    });
  };

  return {
    companyDaysOff: state.companyDaysOff,
    addCompanyDay,
    removeCompanyDay,
    setCompanyDays,
    clearCompanyDays
  };
}

export function useYearSelection() {
  const { state, dispatch } = useOptimizer();

  const setSelectedYear = (year: number) => {
    dispatch({ type: 'SET_YEAR', payload: year });
  };

  return {
    selectedYear: state.selectedYear,
    setSelectedYear
  };
}

export function useHolidays() {
  const { state, dispatch } = useOptimizer();

  const addHoliday = (date: string, name: string) => {
    dispatch({ 
      type: 'ADD_HOLIDAY', 
      payload: { date, name } 
    });
  };

  const removeHoliday = (date: string) => {
    dispatch({ 
      type: 'REMOVE_HOLIDAY', 
      payload: date 
    });
  };

  const setHolidays = (holidays: Array<{ date: string; name: string }>) => {
    dispatch({ 
      type: 'SET_HOLIDAYS', 
      payload: holidays 
    });
  };

  const clearHolidays = () => {
    dispatch({ 
      type: 'SET_HOLIDAYS', 
      payload: [] 
    });
  };

  const setDetectedHolidays = (holidays: Array<{ date: string; name: string }>) => {
    setHolidays(holidays);
  };

  return {
    holidays: state.holidays,
    addHoliday,
    removeHoliday,
    setHolidays,
    clearHolidays,
    setDetectedHolidays
  };
}
