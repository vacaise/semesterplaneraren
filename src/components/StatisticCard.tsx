
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
  return (
    <Card className={`${bgColor} ${borderColor}`}>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className={`text-xl font-semibold ${textColor}`}>{value}</h3>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};
