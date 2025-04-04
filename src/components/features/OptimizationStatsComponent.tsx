import { FC } from 'react';
import { OptimizationStats } from '@/types';
import StatCard from './components/StatCard';
import { BarChart2, Building2, Calendar, CalendarDays, Sun, Umbrella } from 'lucide-react';
import { SectionCard } from '@/components/ui/section-card';
import { t } from '@/lib/translations';

interface OptimizationStatsComponentProps {
  stats: OptimizationStats;
}

const OptimizationStatsComponent: FC<OptimizationStatsComponentProps> = ({ stats }) => {
  return (
    <SectionCard
      title={t('summary')}
      subtitle={t('optimizationStatsSubtitle')}
      icon={<BarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {/* Total Days Off */}
        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          value={stats.totalDaysOff}
          label={t('totalDaysOff')}
          tooltip={t('totalDaysOffTooltip')}
          colorScheme="blue"
        />

        {/* PTO Days */}
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          value={stats.totalPTODays}
          label={t('ptoDays')}
          tooltip={t('ptoDaysTooltip')}
          colorScheme="green"
        />

        {/* Public Holidays */}
        <StatCard
          icon={<Sun className="h-5 w-5" />}
          value={stats.totalPublicHolidays}
          label={t('publicHolidays')}
          tooltip={t('publicHolidaysTooltip')}
          colorScheme="amber"
        />

        {/* Extended Weekends */}
        <StatCard
          icon={<Umbrella className="h-5 w-5" />}
          value={stats.totalExtendedWeekends}
          label={t('extendedWeekends')}
          tooltip={t('extendedWeekendsTooltip')}
          colorScheme="teal"
        />

        {/* Company Days Off */}
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          value={stats.totalCompanyDaysOff}
          label={t('companyDaysOff')}
          tooltip={t('companyDaysOffTooltip')}
          colorScheme="violet"
        />
      </div>
    </SectionCard>
  );
};

export default OptimizationStatsComponent;