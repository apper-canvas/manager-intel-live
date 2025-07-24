import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  className, 
  inputClassName,
  required = false,
  type = "text",
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn(required && "after:content-['*'] after:text-red-500 after:ml-1")}>
        {label}
      </Label>
      <Input
        type={type}
        className={cn(
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          inputClassName
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;