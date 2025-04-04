'use client';

import { motion } from 'framer-motion';
import { Break, OptimizationStats, OptimizedDay } from '@/types';
import OptimizationStatsComponent from '@/components/features/OptimizationStatsComponent';
import { BreakDetails } from '@/components/features/BreakDetails';
import { CalendarView } from '@/components/features/CalendarView';
import { CalendarExport } from '@/components/features/CalendarExport';
import { forwardRef } from 'react';
import { useTranslation } from 'next-i18next'
import { useOptimizationResults } from '@/hooks/useOptimizationResults'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useOnboardingOverlay } from '@/hooks/useOnboardingOverlay'
import { useBreakDetails } from '@/hooks/useBreakDetails'
import { useCalendarExport } from '@/hooks/useCalendarExport'
import { useOptimizationStats } from '@/hooks/useOptimizationStats'
import { useOptimizationHistory } from '@/hooks/useOptimizationHistory'
import { useOptimizationSettings } from '@/hooks/useOptimizationSettings'
import { useOptimizationProgress } from '@/hooks/useOptimizationProgress'
import { useOptimizationError } from '@/hooks/useOptimizationError'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Component Props Types
interface ResultsDisplayProps {
  optimizedDays: OptimizedDay[];
  breaks: Break[];
  stats: OptimizationStats;
  selectedYear: number;
}

export const ResultsDisplay = forwardRef<HTMLDivElement, ResultsDisplayProps>(
  ({ optimizedDays, breaks, stats, selectedYear }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="space-y-8"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Calendar Export - Moved to top for better accessibility */}
        {breaks.length > 0 && (
          <CalendarExport
            breaks={breaks}
            stats={stats}
            selectedYear={selectedYear}
          />
        )}

        {/* Summary Section */}
        <OptimizationStatsComponent stats={stats} />

        {/* Break Details */}
        <BreakDetails breaks={breaks} />

        {/* Calendar View */}
        <CalendarView 
          optimizedDays={optimizedDays} 
          stats={stats} 
          selectedYear={selectedYear}
        />
      </motion.div>
    );
  }
);

ResultsDisplay.displayName = 'ResultsDisplay';