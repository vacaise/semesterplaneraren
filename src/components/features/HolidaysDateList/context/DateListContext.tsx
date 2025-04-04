import { createContext, KeyboardEvent as ReactKeyboardEvent, ReactNode, useContext, useReducer } from 'react';
import { DateItem, GroupedDates } from '../types';
import { useDateGrouping } from '@/components/features/CompanyDaysDateList/hooks/useDateGrouping';
import { useBulkSelection } from '@/components/features/CompanyDaysDateList/hooks/useBulkSelection';
import { useGroupCollapse } from '@/components/features/CompanyDaysDateList/hooks/useGroupCollapse';
import { useHolidays } from '@/hooks/useOptimizer';
import { useState } from 'react';

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
  headingId: string;
  itemCount: number;

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
  cancelEdit: () => void;
  confirmEdit: (date: string) => void;
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
  
  const headingId = `holidays-heading-${Math.random().toString(36).substring(2, 9)}`;
  const itemCount = items.length;
  
  const groupedDates = useDateGrouping(items);
  const { collapsedGroups, setCollapsedGroups } = useGroupCollapse(groupedDates);
  const {
    selectedDates,
    setSelectedDates,
    editingDate,
    setEditingDate,
    editingValue,
    setEditingValue,
    handleBulkRenameConfirm,
  } = useBulkSelection(onBulkRename);

  // Implement the handlers that were missing
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement | HTMLInputElement>, date: string) => {
    // Implementation similar to CompanyDaysDateList
    if (editingDate === null) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmEdit(date);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const startEditing = (date: string, currentName: string) => {
    if (!onUpdateName) return;
    setEditingValue(currentName);
    setEditingDate(date);
  };

  const handleBlur = () => {
    if (editingDate !== null && onUpdateName && editingDate !== 'bulk') {
      onUpdateName(editingDate, editingValue.trim());
      setEditingDate(null);
    }
  };

  const cancelEdit = () => {
    setEditingDate(null);
  };

  const confirmEdit = (date: string) => {
    if (onUpdateName && editingValue.trim()) {
      onUpdateName(date, editingValue.trim());
      setEditingDate(null);
    }
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
    setCollapsedGroups(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const handleBulkRename = () => {
    if (!onBulkRename || selectedDates.length === 0) return;
    
    const selectedItems = items.filter(item => selectedDates.includes(item.date));
    const nameCount = selectedItems.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const commonName = Object.entries(nameCount).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    setEditingValue(commonName);
    setEditingDate('bulk');
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
    headingId,
    itemCount,

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
    cancelEdit,
    confirmEdit,
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
