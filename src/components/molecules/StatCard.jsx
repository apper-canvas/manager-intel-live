import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = "from-cyan-500 to-primary-600"
}) => {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline">
            <p className={cn(
              "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
              `bg-gradient-to-r ${gradient}`
            )}>
              {value}
            </p>
          </div>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "h-4 w-4 mr-1",
                  trend === "up" ? "text-green-500" : "text-red-500"
                )} 
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-r",
          gradient
        )}>
          <ApperIcon name={icon} className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;