
'use client';

import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { CompanyDayOff, OptimizationStrategy } from '../types';

// Define the structure of our state
interface OptimizerState {
  days: string;
  strategy: OptimizationStrategy;
  companyDaysOff: Array<CompanyDayOff>;
  holidays: Array<{ date: string; name: string }>;
  selectedYear: number;
}

// Actions to update the state
type OptimizerAction =
  | { type: 'SET_DAYS'; payload: string }
  | { type: 'SET_STRATEGY'; payload: OptimizationStrategy }
  | { type: 'SET_COMPANY_DAYS'; payload: Array<CompanyDayOff> }
  | { type: 'ADD_COMPANY_DAY'; payload: { date: string; name: string } }
  | { type: 'REMOVE_COMPANY_DAY'; payload: string }
  | { type: 'SET_HOLIDAYS'; payload: Array<{ date: string; name: string }> }
  | { type: 'ADD_HOLIDAY'; payload: { date: string; name: string } }
  | { type: 'REMOVE_HOLIDAY'; payload: string }
  | { type: 'SET_YEAR'; payload: number }
  | { type: 'RESET_STATE' };

// Initial state values
const initialState: OptimizerState = {
  days: '',
  strategy: 'balanced',
  companyDaysOff: [],
  holidays: [],
  selectedYear: new Date().getFullYear(),
};

// Reducer function to handle state updates
function optimizerReducer(state: OptimizerState, action: OptimizerAction): OptimizerState {
  switch (action.type) {
    case 'SET_DAYS':
      return { ...state, days: action.payload };
    case 'SET_STRATEGY':
      return { ...state, strategy: action.payload };
    case 'SET_COMPANY_DAYS':
      return { ...state, companyDaysOff: action.payload };
    case 'ADD_COMPANY_DAY':
      return {
        ...state,
        companyDaysOff: [
          ...state.companyDaysOff,
          { date: action.payload.date, name: action.payload.name },
        ],
      };
    case 'REMOVE_COMPANY_DAY':
      return {
        ...state,
        companyDaysOff: state.companyDaysOff.filter((day) => day.date !== action.payload),
      };
    case 'SET_HOLIDAYS':
      return { ...state, holidays: action.payload };
    case 'ADD_HOLIDAY':
      return {
        ...state,
        holidays: [...state.holidays, { date: action.payload.date, name: action.payload.name }],
      };
    case 'REMOVE_HOLIDAY':
      return {
        ...state,
        holidays: state.holidays.filter((holiday) => holiday.date !== action.payload),
      };
    case 'SET_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Create context with default values
interface OptimizerContextType {
  state: OptimizerState;
  dispatch: React.Dispatch<OptimizerAction>;
}

const OptimizerContext = createContext<OptimizerContextType | undefined>(undefined);

// Create provider component
export function OptimizerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(optimizerReducer, initialState);

  return (
    <OptimizerContext.Provider value={{ state, dispatch }}>
      {children}
    </OptimizerContext.Provider>
  );
}

// Custom hook for using the optimizer context
export function useOptimizer() {
  const context = useContext(OptimizerContext);
  if (context === undefined) {
    throw new Error('useOptimizer must be used within an OptimizerProvider');
  }
  return context;
}
