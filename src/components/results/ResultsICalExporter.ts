
import { useToast } from "@/hooks/use-toast";

interface Period {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
}

interface Schedule {
  periods: Period[];
}

export const useICalExporter = () => {
  const { toast } = useToast();
  
  const exportToICal = (schedule: Schedule, year: number) => {
    let iCalData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//vacai//SE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    schedule.periods.forEach((period, index) => {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      
      // Format dates for iCal (YYYYMMDD)
      const formatICalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      // Add one day to the end date for iCal (exclusive end date)
      const endDateIcal = new Date(endDate);
      endDateIcal.setDate(endDateIcal.getDate() + 1);

      // Create event
      iCalData = [
        ...iCalData,
        "BEGIN:VEVENT",
        `UID:vacai-${year}-${index}@vacai.se`,
        `DTSTAMP:${formatICalDate(new Date())}T000000Z`,
        `DTSTART;VALUE=DATE:${formatICalDate(startDate)}`,
        `DTEND;VALUE=DATE:${formatICalDate(endDateIcal)}`,
        `SUMMARY:${period.description}`,
        `DESCRIPTION:${period.days} dagar ledigt. ${period.vacationDaysNeeded} semesterdagar.`,
        "END:VEVENT"
      ];
    });

    iCalData.push("END:VCALENDAR");

    // Create and download the file
    const blob = new Blob([iCalData.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vacai-${year}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Kalender exporterad",
      description: "Din ledighetsplan har exporterats som en iCal-fil (.ics)",
    });
  };
  
  return { exportToICal };
};
