
import { DateListItem } from './DateListItem';
import { motion } from 'framer-motion';
import { ANIMATION_CONFIG } from '../constants/animations';
import { useDateList } from '../context/DateListContext';
import { BulkRenameInput } from '@/components/features/CompanyDaysDateList/components/BulkRenameInput';

export function FlatView() {
  const { items, editingDate } = useDateList();

  return (
    <>
      {/* Bulk Rename Input - Shows at the top when in bulk edit mode */}
      {editingDate === 'bulk' && (
        <div className="p-3">
          <BulkRenameInput />
        </div>
      )}

      {items.length === 0 ? (
        <motion.li
          {...ANIMATION_CONFIG}
          className="p-3 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">No dates selected</p>
        </motion.li>
      ) : (
        items.map((item) => (
          <motion.li key={item.date} {...ANIMATION_CONFIG}>
            <DateListItem item={item} />
          </motion.li>
        ))
      )}
    </>
  );
}
