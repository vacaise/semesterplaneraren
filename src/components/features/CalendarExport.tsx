
import { Break, OptimizationStats } from '@/types';
import { Button } from '@/components/ui/button';
import { FileDown, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { SectionCard } from '@/components/ui/section-card';

interface CalendarExportProps {
  breaks: Break[];
  stats: OptimizationStats;
  selectedYear: number;
}

export function CalendarExport({ breaks, stats, selectedYear }: CalendarExportProps) {
  const handleExportICS = () => {
    // Create ICS file content
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Holiday Optimizer//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:Optimized PTO ${selectedYear}`,
      'X-WR-TIMEZONE:UTC',
    ];
    
    // Add events for each break
    breaks.forEach((breakPeriod, index) => {
      const startDate = parseISO(breakPeriod.startDate);
      const endDate = parseISO(breakPeriod.endDate);
      
      // Determine break type by days
      let breakType = 'Break';
      if (breakPeriod.totalDays >= 10) {
        breakType = 'Extended Vacation';
      } else if (breakPeriod.totalDays >= 7) {
        breakType = 'Week-long Break';
      } else if (breakPeriod.totalDays >= 5) {
        breakType = 'Mini Break';
      } else if (breakPeriod.totalDays >= 3) {
        breakType = 'Long Weekend';
      }
      
      const summary = `${breakType}: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
      
      // Format dates as required for ICS
      const formatDateForICS = (date: Date) => {
        return format(date, "yyyyMMdd'T'HHmmss'Z'");
      };
      
      // Add one day to end date for all-day events
      const eventEndDate = new Date(endDate);
      eventEndDate.setDate(eventEndDate.getDate() + 1);
      
      // Create description with break details
      const description = [
        `Holiday Optimizer: ${breakType}`,
        `Total Days: ${breakPeriod.totalDays}`,
        `PTO Days: ${breakPeriod.ptoDays}`,
        `Public Holidays: ${breakPeriod.publicHolidays}`,
        `Weekend Days: ${breakPeriod.weekends}`,
        `Company Days Off: ${breakPeriod.companyDaysOff}`,
      ].join('\\n');
      
      icsContent = [
        ...icsContent,
        'BEGIN:VEVENT',
        `UID:holiday-optimizer-${selectedYear}-break-${index}`,
        `DTSTAMP:${formatDateForICS(new Date())}`,
        `DTSTART;VALUE=DATE:${format(startDate, 'yyyyMMdd')}`,
        `DTEND;VALUE=DATE:${format(eventEndDate, 'yyyyMMdd')}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        'TRANSP:TRANSPARENT',
        'END:VEVENT',
      ];
    });
    
    // End calendar
    icsContent.push('END:VCALENDAR');
    
    // Join with newlines and create download link
    const icsData = icsContent.join('\r\n');
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and click it
    const link = document.createElement('a');
    link.href = url;
    link.download = `holiday-optimizer-${selectedYear}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <SectionCard
      title="Export Your Optimized Schedule"
      subtitle="Add your breaks to your calendar"
      icon={<Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="space-y-1.5">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Export {breaks.length} breaks ({stats.totalPTODays} PTO days) as calendar events
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Download an .ics file that works with Google Calendar, Apple Calendar, Outlook and more
          </p>
        </div>
        
        <Button
          onClick={handleExportICS}
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2 whitespace-nowrap"
          aria-label={`Export ${breaks.length} breaks to calendar`}
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          <span>Export to Calendar</span>
        </Button>
      </div>
    </SectionCard>
  );
}
