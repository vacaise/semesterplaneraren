import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Pencil, X } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateItem } from '../types';
import { colorStyles } from '../constants/styles';
import { useRef } from 'react';
import { useDateList } from '../context/DateListContext';

interface DateListItemProps {
  item: DateItem;
}

export function DateListItem({ item }: DateListItemProps) {
  const {
    editingDate,
    editingValue,
    colorScheme,
    setEditingValue,
    startEditing,
    cancelEdit,
    confirmEdit,
    onRemoveAction,
  } = useDateList();

  // Only keep the input ref which is needed for autofocus
  const inputRef = useRef<HTMLInputElement>(null);

  // Format the date for display and accessibility
  const formattedDate = format(
    parse(item.date, 'yyyy-MM-dd', new Date()),
    'MMMM d, yyyy',
  );

  // Determine if we're in edit mode for this item
  const isEditing = editingDate === item.date;

  // Handle keyboard events for edit mode
  const handleEditModeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      confirmEdit(item.date);
    }
  };

  // Handle keyboard events for both edit and remove buttons
  const handleButtonKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div
      className={cn(
        'group/item relative',
        'border-t',
        colorStyles[colorScheme].divider,
        colorStyles[colorScheme].hover,
        'transition-colors duration-200',
      )}
      data-date={item.date}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div
              className="flex items-center gap-1.5"
            >
              <Input
                ref={inputRef}
                autoFocus
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={handleEditModeKeyDown}
                className={cn(
                  'h-7 text-sm font-medium flex-1',
                  'bg-white dark:bg-gray-900',
                  colorStyles[colorScheme].input,
                  colorStyles[colorScheme].text,
                )}
                aria-label={`Edit name for ${formattedDate}`}
                data-edit-input="true"
              />
              <div className="flex gap-1" role="group" aria-label="Edit actions">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  onKeyDown={(e) => handleButtonKeyDown(e, cancelEdit)}
                  className={cn(
                    'h-7 w-7 p-0',
                    colorStyles[colorScheme].hover,
                    'hover:bg-red-100/70 dark:hover:bg-red-900/30',
                    'group focus:ring-1 focus:ring-red-500 focus:ring-offset-1',
                  )}
                  tabIndex={0}
                  aria-label="Cancel edit"
                  data-cancel-button="true"
                >
                  <X className={cn(
                    'h-3.5 w-3.5',
                    colorStyles[colorScheme].accent,
                    'group-hover:text-red-500 dark:group-hover:text-red-400',
                  )} />
                </Button>
                <Button
                  type="button"
                  onClick={() => confirmEdit(item.date)}
                  onKeyDown={(e) => handleButtonKeyDown(e, () => confirmEdit(item.date))}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 w-7 p-0',
                    colorStyles[colorScheme].hover,
                    'hover:bg-green-100/70 dark:hover:bg-green-900/30',
                    'group focus:ring-1 focus:ring-green-500 focus:ring-offset-1',
                  )}
                  tabIndex={0}
                  aria-label="Confirm edit"
                  data-confirm-button="true"
                >
                  <Check className={cn(
                    'h-3.5 w-3.5',
                    colorStyles[colorScheme].accent,
                    'group-hover:text-green-500 dark:group-hover:text-green-400',
                  )} />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <p className={cn(
                  'text-sm font-medium',
                  colorStyles[colorScheme].text,
                )}>
                  {item.name}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(item.date, item.name)}
                  onKeyDown={(e) => handleButtonKeyDown(e, () => startEditing(item.date, item.name))}
                  className={cn(
                    'h-6 w-6 p-0',
                    'opacity-0 group-hover/item:opacity-100 focus:opacity-100',
                    'transition-all duration-200',
                    colorStyles[colorScheme].hover,
                    'hover:scale-110 active:scale-95',
                    'focus:ring-1 focus:ring-amber-500 focus:ring-offset-1',
                  )}
                  aria-label={`Edit name for ${item.name}`}
                  tabIndex={0}
                  data-date={item.date}
                  data-edit-button="true"
                >
                  <Pencil className={cn(
                    'h-3 w-3',
                    colorStyles[colorScheme].accent,
                  )} />
                </Button>
              </div>
              <time
                dateTime={item.date}
                className={cn(
                  'block text-xs mt-0.5',
                  colorStyles[colorScheme].muted,
                )}
              >
                {formattedDate}
              </time>
            </>
          )}
        </div>

        {/* Remove Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemoveAction(item.date)}
          onKeyDown={(e) => handleButtonKeyDown(e, () => onRemoveAction(item.date))}
          className={cn(
            'h-7 w-7 p-0',
            'opacity-0 group-hover/item:opacity-100 focus:opacity-100',
            'transition-all duration-200',
            colorStyles[colorScheme].hover,
            'group focus:ring-1 focus:ring-red-500 focus:ring-offset-1',
            isEditing ? 'opacity-100' : '', // Always show when in edit mode
          )}
          tabIndex={0}
          aria-label={`Remove ${item.name}`}
          data-date-remove-button="true"
        >
          <X className={cn(
            'h-3.5 w-3.5',
            colorStyles[colorScheme].accent,
            'group-hover:text-red-500 dark:group-hover:text-red-400',
          )} />
        </Button>
      </div>
    </div>
  );
} 