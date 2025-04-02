
import React from "react";
import { format, isWeekend, isSameDay, isPast } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  year: number;
  onAddHoliday: () => void;
  onAddCompanyDay: () => void;
  addingCompanyDay: boolean;
  holidays?: Date[];
  companyDays?: Date[];
}

export const DatePickerCalendar = ({
  selectedDate,
  setSelectedDate,
  year,
  onAddHoliday,
  onAddCompanyDay,
  addingCompanyDay,
  holidays = [],
  companyDays = []
}: DatePickerCalendarProps) => {
  const handleDayClick = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const isDateDisabled = (date: Date) => {
    const isPastDate = isPast(date) && !isSameDay(date, new Date());
    
    // Check if the date is already a holiday or company day
    const isHoliday = holidays.some(holiday => 
      isSameDay(holiday, date)
    );
    
    const isCompanyDay = companyDays.some(companyDay => 
      isSameDay(companyDay, date)
    );
    
    // If we're adding a company day, don't allow selecting holidays
    // If we're adding a holiday, don't allow selecting company days
    if (addingCompanyDay) {
      return isPastDate || isHoliday || isCompanyDay;
    } else {
      return isPastDate || isHoliday || isCompanyDay;
    }
  };

  // Create custom modifiers
  const modifiers = {
    weekend: (date: Date) => isWeekend(date),
    holiday: (date: Date) => holidays.some(holiday => isSameDay(holiday, date)),
    companyDay: (date: Date) => companyDays.some(companyDay => isSameDay(companyDay, date))
  };

  // Custom className functions for each day type
  const modifiersStyles = {
    weekend: "bg-orange-100 text-orange-800",
    holiday: "bg-red-200 text-red-800",
    companyDay: "bg-purple-200 text-purple-800"
  };

  // Create a default date for the calendar at the beginning of the specified year
  const defaultMonth = new Date(year, 0); // January of the specified year

  return (
    <div className="border rounded-lg overflow-hidden bg-white p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDayClick}
        defaultMonth={defaultMonth}
        showOutsideDays={false}
        className="rounded-md"
        classNames={{
          day_selected: "bg-blue-500 text-white",
          day_disabled: "text-gray-300 hover:bg-transparent",
          day_outside: "hidden"
        }}
        modifiers={modifiers}
        modifiersClassNames={modifiersStyles}
        disabled={isDateDisabled}
      />
      {selectedDate && (
        <div className="mt-4">
          <p className="mb-2 text-sm">
            {format(selectedDate, "EEEE d MMMM yyyy", { locale: sv })}
          </p>
          {addingCompanyDay ? (
            <Button 
              onClick={onAddCompanyDay} 
              className="w-full"
            >
              Lägg till klämdag
            </Button>
          ) : (
            <Button 
              onClick={onAddHoliday} 
              className="w-full"
            >
              Lägg till röd dag
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
