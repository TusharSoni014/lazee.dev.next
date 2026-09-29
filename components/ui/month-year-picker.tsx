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
    onChange(new Date(viewYear, monthIndex, 1));
  };

  return (
    <div className={cn("p-3 w-[260px]", className)}>
      {/* Year navigator */}
      <div className="flex items-center justify-between mb-3 px-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goToPrevYear}
          disabled={viewYear <= minYear}
          className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 select-none">
          {viewYear}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goToNextYear}
          disabled={viewYear >= maxYear}
          className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {MONTHS.map((month, index) => {
          const isSelected =
            selectedYear === viewYear && selectedMonth === index;
          const isDisabled = isMonthDisabled(index);

          return (
            <button
              key={month}
              type="button"
              onClick={() => handleSelect(index)}
              disabled={isDisabled}
              className={cn(
                "h-8 rounded-lg text-xs font-medium transition-all text-center",
                isSelected
                  ? "bg-orange-600 text-white font-semibold shadow-xs"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
                isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent text-zinc-400"
              )}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
}
