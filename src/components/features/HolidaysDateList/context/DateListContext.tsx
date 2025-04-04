
import { createContext, KeyboardEvent as ReactKeyboardEvent, ReactNode, useContext } from 'react';
import { DateItem, GroupedDates } from '../types';
import { useDateGrouping } from '@/components/features/CompanyDaysDateList/hooks/useDateGrouping';
import { useBulkSelection } from '@/components/features/CompanyDaysDateList/hooks/useBulkSelection';
import { useGroupCollapse } from '@/components/features/CompanyDaysDateList/hooks/useGroupCollapse';
import { useHolidays } from '@/hooks/useOptimizer';

export interface DateListContextProps {
  // State
  items: DateItem[];
  title: string;
  colorScheme: 'amber';
  groupedDates: GroupedDates[];
  selectedDates: string[];
  collapsedGroups: string[];
  editingDate: string | null;
  editingValue: string;

  // Actions
  setSelectedDates: (fn: (prev: string[]) => string[]) => void;
  setEditingDate: (date: string | null) => void;
  setEditingValue: (value: string) => void;
  setCollapsedGroups: (fn: (prev: string[]) => string[]) => void;

  // Handlers
  handleSelectGroup: (name: string) => void;
  toggleGroupCollapse: (name: string) => void;
  handleKeyDown: (e: ReactKeyboardEvent<HTMLButtonElement | HTMLInputElement>, date: string) => void;
  startEditing: (date: string, currentName: string) => void;
  handleBlur: () => void;
  handleBulkRename: () => void;
  handleBulkRenameConfirm: () => void;
  onRemoveAction: (date: string) => void;
  onClearAllAction: () => void;
  onUpdateName?: (date: string, newName: string) => void;
}

const DateListContext = createContext<DateListContextProps | undefined>(undefined);

export interface DateListProviderProps {
  children: ReactNode;
  title: string;
  colorScheme: 'amber';
  onBulkRename?: (dates: string[], newName: string) => void;
}

export const DateListProvider = ({
  children,
  title,
  colorScheme,
  onBulkRename,
}: DateListProviderProps) => {
  const {
    holidays: items,
    addHoliday: onUpdateName,
    removeHoliday: onRemoveAction,
    clearHolidays: onClearAllAction,
  } = useHolidays();
  
  const groupedDates = useDateGrouping(items);
  const { collapsedGroups, setCollapsedGroups } = useGroupCollapse(groupedDates);
  const {
    selectedDates,
    setSelectedDates,
    editingDate,
    setEditingDate,
    editingValue,
    setEditingValue,
    handleBulkRename: bulkRename,
    handleBulkRenameConfirm,
  } = useBulkSelection(onBulkRename);

  // Implement the remaining handlers similarly to CompanyDaysDateList
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement | HTMLInputElement>, date: string) => {
    // Implementation similar to CompanyDaysDateList
  };

  const startEditing = (date: string, currentName: string) => {
    // Implementation similar to CompanyDaysDateList
  };

  const handleBlur = () => {
    // Implementation similar to CompanyDaysDateList
  };

  const handleSelectGroup = (name: string) => {
    const groupDates = groupedDates.find(g => g.name === name)?.dates || [];
    const dates = groupDates.map(d => d.date);
    const allSelected = dates.every(date => selectedDates.includes(date));
    setSelectedDates(prev =>
      allSelected
        ? prev.filter(d => !dates.includes(d))
        : [...Array.from(new Set([...prev, ...dates]))]
    );
  };

  const toggleGroupCollapse = (name: string) => {
    // Implementation similar to CompanyDaysDateList
  };

  const handleBulkRename = () => {
    // Implementation similar to CompanyDaysDateList
  };

  const value: DateListContextProps = {
    // State
    items,
    title,
    colorScheme,
    groupedDates,
    selectedDates,
    collapsedGroups,
    editingDate,
    editingValue,

    // Actions
    setSelectedDates,
    setEditingDate,
    setEditingValue,
    setCollapsedGroups,

    // Handlers
    handleSelectGroup,
    toggleGroupCollapse,
    handleKeyDown,
    startEditing,
    handleBlur,
    handleBulkRename,
    handleBulkRenameConfirm,
    onRemoveAction,
    onClearAllAction,
    onUpdateName,
  };

  return (
    <DateListContext.Provider value={value}>
      {children}
    </DateListContext.Provider>
  );
};

export const useDateList = () => {
  const context = useContext(DateListContext);

  if (context === undefined) {
    throw new Error('useDateList must be used within a DateListProvider');
  }

  return context;
};
