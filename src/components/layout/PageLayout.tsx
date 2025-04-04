
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={cn('flex-1 w-full', className)}>{children}</main>
      <Footer />
    </div>
  );
};

export const PageHeader = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <header className={cn('bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-800', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {children}
      </div>
    </header>
  );
};

export const PageContent = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn('py-8 sm:py-12', className)}>
      {children}
    </div>
  );
};

export const PageTitle = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <h1 className={cn('text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white', className)}>
      {children}
    </h1>
  );
};

export const PageDescription = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <p className={cn('mt-2 text-lg sm:text-xl text-gray-600 dark:text-gray-300', className)}>
      {children}
    </p>
  );
};
