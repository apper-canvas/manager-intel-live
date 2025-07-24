import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  icon = "Database",
  actionLabel,
  onAction,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] text-center", className)}>
      <div className="mb-6 p-6 rounded-full bg-gradient-to-r from-gray-50 to-gray-100">
        <ApperIcon name={icon} className="h-16 w-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;