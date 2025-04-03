
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticCardProps {
  title: string;
  value: string | number;
  description?: string;
  color?: "teal" | "orange" | "blue" | "purple";
  icon?: React.ReactNode;
  smallValue?: boolean;
}

const StatisticCard = ({
  title,
  value,
  description,
  color = "teal",
  icon,
  smallValue = false,
}: StatisticCardProps) => {
  // Map colors to Tailwind classes
  const colorMap = {
    teal: "bg-teal-50 text-teal-800 border-teal-100",
    orange: "bg-orange-50 text-orange-800 border-orange-100",
    blue: "bg-blue-50 text-blue-800 border-blue-100",
    purple: "bg-purple-50 text-purple-800 border-purple-100",
  };

  return (
    <Card className={`border ${colorMap[color]}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {icon && <div className="text-2xl">{icon}</div>}
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className={`font-semibold ${smallValue ? "text-lg" : "text-3xl"} mt-1`}>
              {value}
            </div>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
