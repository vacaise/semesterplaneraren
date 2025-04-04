import { parse } from 'date-fns';
import { motion } from 'framer-motion';
import { ANIMATION_CONFIG } from '../constants/animations';
import { DateListItem } from './DateListItem';
import { useDateList } from '../context/DateListContext';

export function FlatView() {
  const { items } = useDateList();
  
  // Simple date sort without any bulk or grouping functionality
  const sortedItems = [...items].sort((a, b) =>
    parse(a.date, 'yyyy-MM-dd', new Date()).getTime() -
    parse(b.date, 'yyyy-MM-dd', new Date()).getTime()
  );

  return (
    <>
      {items.length === 0 ? (
        <motion.div
          {...ANIMATION_CONFIG}
          className="p-3 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">No dates selected</p>
        </motion.div>
      ) : (
        sortedItems.map((item, index) => (
          <motion.div
            key={item.date}
            {...ANIMATION_CONFIG}
            data-list-item="true"
            data-list-index={index}
          >
            <DateListItem item={item} />
          </motion.div>
        ))
      )}
    </>
  );
} 