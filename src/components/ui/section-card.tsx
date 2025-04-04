
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  icon,
  children,
  rightContent,
  className,
}: SectionCardProps) {
  return (
    <section className={cn(
      'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800',
      className
    )}>
      <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 pt-0.5">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {rightContent && (
          <div className="flex-shrink-0">
            {rightContent}
          </div>
        )}
      </header>
      
      <div className="p-4 space-y-6">
        {children}
      </div>
    </section>
  );
}
