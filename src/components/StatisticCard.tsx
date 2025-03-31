
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticCardProps {
  value: number | string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const StatisticCard = ({ 
  value, 
  label, 
  bgColor, 
  borderColor, 
  textColor 
}: StatisticCardProps) => {
  // Ensure we always display a valid value
  const displayValue = (() => {
    if (typeof value === 'number') {
      // Format numbers to handle decimal places properly
      if (label === "Effektivitet") {
        // For efficiency, always show with "x" suffix and 2 decimal places
        return `${value}x`;
      }
      return isNaN(value) ? "0" : value.toString();
    } else if (value === null || value === undefined) {
      return "0";
    } else if (typeof value === 'string') {
      // Clean up any NaN strings
      if (value.includes('NaN')) {
        return value.replace('NaN', '0');
      }
      return value;
    }
    return value;
  })();

  return (
    <Card className={`${bgColor} ${borderColor}`}>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className={`text-xl font-semibold ${textColor}`}>{displayValue}</h3>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};
