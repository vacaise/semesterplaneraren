
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { PROJECT_NAME } from '@/constants';

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900">
        <Calendar className="h-5 w-5 text-teal-700 dark:text-teal-300" aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="text-lg font-bold text-gray-900 dark:text-white">{PROJECT_NAME}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Maximize your free time</span>
      </span>
    </Link>
  );
};
