'use client';

import { useEffect, useRef, useState } from 'react';
import { ResultsDisplay } from '@/components/features/ResultsDisplay';
import { OptimizerForm } from '@/components/OptimizerForm';
import { OptimizerProvider } from '@/contexts/OptimizerContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { CompanyDayOff, OptimizationResult, OptimizationStrategy } from '@/types';
import { optimizeDaysAsync } from '@/services/optimizer';
import { PageContent, PageDescription, PageHeader, PageLayout, PageTitle } from '@/components/layout/PageLayout';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { t, tWithParams } from '@/lib/translations';

interface FormState {
  numberOfDays: number | null
  strategy: OptimizationStrategy
  companyDaysOff: Array<CompanyDayOff>
  holidays: Array<{ date: string, name: string }>
  selectedYear: number
}

const HomePage = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [shouldScrollToResults, setShouldScrollToResults] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleOptimize = async (data: FormState) => {
    if (data.numberOfDays === null) return;

    try {
      setIsOptimizing(true);
      setSelectedYear(data.selectedYear);
      const result = await optimizeDaysAsync({
        numberOfDays: data.numberOfDays,
        strategy: data.strategy,
        year: data.selectedYear,
        companyDaysOff: data.companyDaysOff,
        holidays: data.holidays
      });
      setOptimizationResult({
        days: result.days,
        breaks: result.breaks,
        stats: result.stats
      });
      setShouldScrollToResults(true);
    } catch (e) {
      console.error('Optimization error:', e);
      setOptimizationResult(null);
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    if (shouldScrollToResults && resultsRef.current && window.innerWidth < 1024) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShouldScrollToResults(false);
    }
  }, [shouldScrollToResults, optimizationResult]);

  return (
    <OptimizerProvider>
      <OnboardingProvider>
        <PageLayout>
          <PageHeader>
            <PageTitle>{t('pageTitle')}</PageTitle>
            <PageDescription>
              {tWithParams('pageDescription', { year: selectedYear.toString() })}
            </PageDescription>
          </PageHeader>

          <PageContent>
            <section 
              className={cn(
                "grid gap-6 mx-auto max-w-[1400px]",
                isOptimizing || optimizationResult ? 'lg:grid-cols-[minmax(480px,1fr),minmax(480px,2fr)]' : ''
              )}
              aria-label={t('optimizationForm')}
            >
              {/* Form Section - Always visible */}
              <div className={cn(
                "space-y-4",
                isOptimizing || optimizationResult 
                  ? 'lg:sticky lg:top-6 lg:self-start max-w-2xl' 
                  : 'max-w-xl mx-auto w-full'
              )}>
                <h2 className="sr-only">{t('optimizationForm')}</h2>
                <OptimizerForm
                  onSubmitAction={({ days, strategy, companyDaysOff, holidays, selectedYear }) => {
                    const newFormState = {
                      numberOfDays: days,
                      strategy,
                      companyDaysOff,
                      holidays,
                      selectedYear
                    };
                    handleOptimize(newFormState);
                  }}
                />
              </div>

              {/* Results Section - Only visible when optimizing or when results exist */}
              {(isOptimizing || optimizationResult) && (
                <div ref={resultsRef} className="space-y-6">
                  <h2 className="sr-only">{t('optimizationResults')}</h2>
                  {isOptimizing ? (
                    <Card className="p-6">
                      <div className="flex items-center justify-center space-x-4">
                        <LoadingSpinner />
                        <div>
                          <h3 className="text-lg font-semibold">{t('creatingSchedule')}</h3>
                          <p className="text-muted-foreground">
                            {tWithParams('findingBestWay', { year: selectedYear.toString() })}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : optimizationResult && (
                    <ResultsDisplay
                      optimizedDays={optimizationResult.days}
                      breaks={optimizationResult.breaks}
                      stats={optimizationResult.stats}
                      selectedYear={selectedYear}
                    />
                  )}
                </div>
              )}
            </section>
          </PageContent>
        </PageLayout>
      </OnboardingProvider>
    </OptimizerProvider>
  );
};

export default HomePage;
