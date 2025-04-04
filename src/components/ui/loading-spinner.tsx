
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
  label?: string;
  description?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  label,
  description,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const variants = {
    default: 'text-gray-400 dark:text-gray-600',
    primary: 'text-teal-600 dark:text-teal-400',
    accent: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <svg
        className={cn('animate-spin', sizes[size], variants[variant])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {label && (
        <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
      )}
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}
