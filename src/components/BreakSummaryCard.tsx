
import React from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateRange } from "@/utils/vacationOptimizer/helpers";

interface BreakSummaryCardProps {
  title: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  vacationDaysNeeded: number;
  type: string;
}

const BreakSummaryCard = ({
  title,
  startDate,
  endDate,
  totalDays,
  vacationDaysNeeded,
  type,
}: BreakSummaryCardProps) => {
  // Generate different background colors based on break type
  const getBgColor = () => {
    switch (type) {
      case "holiday":
        return "bg-red-50 border-red-100";
      case "bridge":
        return "bg-teal-50 border-teal-100";
      case "weekend":
        return "bg-yellow-50 border-yellow-100";
      case "summer":
        return "bg-blue-50 border-blue-100";
      case "winter":
        return "bg-indigo-50 border-indigo-100";
      case "fall":
        return "bg-orange-50 border-orange-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  return (
    <Card className={`border ${getBgColor()}`}>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg">{title}</h3>
        <div className="mt-2 mb-2">
          <div className="text-sm text-gray-600">
            {formatDateRange(startDate, endDate)}
          </div>
          <div className="mt-1 flex items-center gap-4">
            <div className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {totalDays} dagar
            </div>
            <div className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {vacationDaysNeeded} semesterdagar
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {format(startDate, "EEEE d MMMM", { locale: sv })} - {format(endDate, "EEEE d MMMM", { locale: sv })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreakSummaryCard;
