
import { motion } from 'framer-motion';
import { OptimizationStats } from '@/types';
import { Calendar, CheckCircle, Clock, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Variants for animation
const statItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 260,
      damping: 20 
    }
  }
};

// Stat card component
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accentColor: string;
  suffix?: string;
}

const StatCard = ({ label, value, icon, accentColor, suffix = '' }: StatCardProps) => (
  <motion.div 
    variants={statItem}
    className={cn(
      "flex items-center gap-3 p-4 rounded-lg border",
      "bg-white dark:bg-gray-800",
      "border-gray-200 dark:border-gray-700"
    )}
  >
    <div className={cn(
      "flex items-center justify-center p-2.5 rounded-md",
      accentColor
    )}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        {suffix && <span className="text-sm text-gray-500 dark:text-gray-400">{suffix}</span>}
      </div>
    </div>
  </motion.div>
);

interface OptimizationStatsComponentProps {
  stats: OptimizationStats;
}

const OptimizationStatsComponent = ({ stats }: OptimizationStatsComponentProps) => {
  return (
    <motion.section 
      initial="hidden"
      animate="show"
      variants={{
        show: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-4"
    >
      <motion.h2 
        variants={statItem}
        className="text-lg font-semibold text-gray-900 dark:text-white"
      >
        Your Optimization Summary
      </motion.h2>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          label="Total Days Off" 
          value={stats.totalDaysOff} 
          icon={<Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />} 
          accentColor="bg-indigo-100 dark:bg-indigo-900/30"
          suffix="days"
        />
        <StatCard 
          label="PTO Days Used" 
          value={stats.totalPTODays} 
          icon={<Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />} 
          accentColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard 
          label="Extended Weekends" 
          value={stats.totalExtendedWeekends} 
          icon={<Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />} 
          accentColor="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatCard 
          label="Public Holidays" 
          value={stats.totalPublicHolidays} 
          icon={<Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />} 
          accentColor="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard 
          label="Company Days Off" 
          value={stats.totalCompanyDaysOff} 
          icon={<CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />} 
          accentColor="bg-teal-100 dark:bg-teal-900/30"
        />
      </div>
    </motion.section>
  );
};

export default OptimizationStatsComponent;
