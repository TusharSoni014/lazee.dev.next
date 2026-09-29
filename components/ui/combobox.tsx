"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: React.ReactNode;
  searchString: string;
  displayLabel?: React.ReactNode;
  key?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  triggerClassName?: string;
  name?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  triggerClassName,
  name,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter((option) =>
      option.searchString.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  return (
    <div className={cn("relative w-full", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 px-3.5 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 shadow-2xs transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-left",
              triggerClassName
            )}
          >
            <span className="truncate">
              {selectedOption ? (selectedOption.displayLabel || selectedOption.label) : (
                <span className="text-zinc-400 dark:text-zinc-500 font-normal">{placeholder}</span>
              )}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl shadow-lg z-[100]"
          align="start"
        >
          <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800/80 px-2.5 pb-1.5 pt-0.5 mb-1">
            <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="flex h-8 w-full rounded-none bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>
          <div className="max-h-[240px] overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.key || `${option.value}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center justify-between px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-left transition-colors",
                    option.value === value && "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-semibold"
                  )}
                >
                  <span className="truncate flex-1">{option.label}</span>
                  {option.value === value && (
                    <Check className="ml-2 h-3.5 w-3.5 shrink-0 text-orange-600 dark:text-orange-400" />
                  )}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
