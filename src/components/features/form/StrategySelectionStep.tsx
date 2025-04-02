
import { useState } from 'react';
import { StepHeader } from './components/StepHeader';
import { StepTitleWithInfo } from './components/StepTitleWithInfo';
import { OPTIMIZATION_STRATEGIES } from '@/constants';
import { OptimizationStrategy } from '@/types';
import { cn } from '@/lib/utils';

interface StrategySelectionStepProps {
  selectedStrategy: OptimizationStrategy;
  onStrategyChange: (strategy: OptimizationStrategy) => void;
}

export function StrategySelectionStep({
  selectedStrategy,
  onStrategyChange,
}: StrategySelectionStepProps) {
  const [hasInteractedWithStrategy, setHasInteractedWithStrategy] = useState(false);

  // Cast the strategy to OptimizationStrategy to ensure type safety
  const handleStrategyChange = (strategy: string) => {
    setHasInteractedWithStrategy(true);
    // Only allow valid OptimizationStrategy values
    const validStrategy = strategy as OptimizationStrategy;
    onStrategyChange(validStrategy);
  };

  return (
    <div className="space-y-6">
      <StepHeader
        number={2}
        title={
          <StepTitleWithInfo
            title="Select Optimization Strategy"
            colorScheme="blue"
            tooltip={{
              title: "Strategy Selection",
              description: "Choose how you want to distribute your time off days throughout the year.",
              ariaLabel: "Learn more about optimization strategies",
            }}
          />
        }
        description="Choose an optimization style that matches your preferences for time off."
        colorScheme="blue"
        id="strategy-selection-step"
      />

      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        role="radiogroup"
        aria-labelledby="strategy-selection-step"
      >
        {OPTIMIZATION_STRATEGIES.map((strategyOption) => {
          // Extract id and ensure it's a valid OptimizationStrategy
          const id = strategyOption.id as OptimizationStrategy;
          const isSelected = selectedStrategy === id;

          return (
            <div
              key={id}
              onClick={() => handleStrategyChange(id)}
              className={cn(
                "relative cursor-pointer rounded-lg px-4 py-3",
                "transition-all border duration-150",
                "hover:border-blue-400 hover:shadow-sm",
                "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900",
                isSelected
                  ? "border-blue-400 dark:border-blue-500 ring-1 ring-blue-400/30 dark:ring-blue-500/30 shadow-sm"
                  : "border-gray-200 dark:border-gray-700",
              )}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              data-strategy={id}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleStrategyChange(id);
                }
              }}
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {strategyOption.label}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {strategyOption.description}
              </p>
              {isSelected && (
                <div className="absolute inset-0 z-10 rounded-lg ring-2 ring-blue-400 dark:ring-blue-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
