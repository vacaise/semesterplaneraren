
import React from 'react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GitHubLink } from '@/components/ui/github-link';
import { GITHUB_URL } from '@/constants';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/80 backdrop-blur-sm dark:border-gray-800/80 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <GitHubLink href={GITHUB_URL} variant="compact" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
