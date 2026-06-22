"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface MonthYearPickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  minYear?: number;
  maxDate?: Date;
  className?: string;
}

export function MonthYearPicker({
  value,
  onChange,
  minYear = 1970,
  maxDate,
  className,
}: MonthYearPickerProps) {
  const now = new Date();
  const effectiveMaxDate = maxDate || now;
  const maxYear = effectiveMaxDate.getFullYear();
  const maxMonth = effectiveMaxDate.getMonth();

  const [viewYear, setViewYear] = React.useState(
    value ? value.getFullYear() : now.getFullYear()
  );

  const selectedMonth = value ? value.getMonth() : -1;
  const selectedYear = value ? value.getFullYear() : -1;

  const goToPrevYear = () => {
    if (viewYear > minYear) setViewYear(viewYear - 1);
  };

  const goToNextYear = () => {
    if (viewYear < maxYear) setViewYear(viewYear + 1);
  };

  const isMonthDisabled = (monthIndex: number) => {
    if (viewYear > maxYear) return true;
    if (viewYear === maxYear && monthIndex > maxMonth) return true;
    return false;
  };

  const handleSelect = (monthIndex: number) => {
    if (isMonthDisabled(monthIndex)) return;
    // Set to the 1st of the selected month
    onChange(new Date(viewYear, monthIndex, 1));
  };

  return (
    <div className={cn("p-3 w-[280px]", className)}>
      {/* Year navigator */}
      <div className="flex items-center justify-between mb-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goToPrevYear}
          disabled={viewYear <= minYear}
          className="h-8 w-8 rounded-none border-2 border-black hover:bg-orange-50 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-black uppercase tracking-widest select-none">
          {viewYear}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goToNextYear}
          disabled={viewYear >= maxYear}
          className="h-8 w-8 rounded-none border-2 border-black hover:bg-orange-50 disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((month, index) => {
          const isSelected =
            selectedYear === viewYear && selectedMonth === index;
          const isDisabled = isMonthDisabled(index);

          return (
            <Button
              key={month}
              type="button"
              variant="ghost"
              onClick={() => handleSelect(index)}
              disabled={isDisabled}
              className={cn(
                "h-9 rounded-none border-2 text-xs font-black uppercase tracking-wider transition-all",
                isSelected
                  ? "bg-black text-white border-black hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "border-zinc-300 bg-white text-black hover:bg-orange-50 hover:border-black",
                isDisabled && "opacity-30 cursor-not-allowed hover:bg-white hover:border-zinc-300"
              )}
            >
              {month}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
