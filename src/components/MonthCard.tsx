
import React from "react";
import { format, getDaysInMonth, startOfMonth, getDay } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDay } from "@/components/CalendarDay";
import { getDayType } from "@/utils/calendarDayUtils";

interface Period {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
}

interface MonthCardProps {
  year: number;
  monthIndex: number;
  periods: Period[];
  holidays: Date[];
}

export const MonthCard = ({ year, monthIndex, periods, holidays }: MonthCardProps) => {
  const monthDate = new Date(year, monthIndex, 1);
  const daysInMonth = getDaysInMonth(monthDate);
  const firstDayOfMonth = startOfMonth(monthDate);
  const firstDayWeekday = getDay(firstDayOfMonth); // 0 för söndag, 1 för måndag, etc.
  
  // Vi använder svenska veckan som börjar med måndag (index 0)
  const adjustedFirstDay = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  const daysArray = [];
  // Lägg till tomma celler för dagar före månadens start
  for (let i = 0; i < adjustedFirstDay; i++) {
    daysArray.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }

  // Lägg till dagar i månaden
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const dayType = getDayType(date, holidays, periods);
    
    daysArray.push(
      <CalendarDay 
        key={`day-${day}`}
        date={date}
        dayNumber={day}
        dayType={dayType}
      />
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {format(monthDate, "MMMM yyyy", { locale: sv })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          <div className="text-center text-gray-500 font-medium">Mån</div>
          <div className="text-center text-gray-500 font-medium">Tis</div>
          <div className="text-center text-gray-500 font-medium">Ons</div>
          <div className="text-center text-gray-500 font-medium">Tor</div>
          <div className="text-center text-gray-500 font-medium">Fre</div>
          <div className="text-center text-gray-500 font-medium">Lör</div>
          <div className="text-center text-gray-500 font-medium">Sön</div>
          {daysArray}
        </div>
      </CardContent>
    </Card>
  );
};
