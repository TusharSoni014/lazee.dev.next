"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: React.ReactNode
  searchString: string
  displayLabel?: React.ReactNode
  key?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  triggerClassName?: string
  name?: string
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
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedOption = options.find((option) => option.value === value)

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    const lowerSearch = search.toLowerCase()
    return options.filter((option) =>
      option.searchString.toLowerCase().includes(lowerSearch)
    )
  }, [options, search])

  return (
    <div className={cn("relative w-full", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-[50px] w-full items-center justify-between rounded-none border-[3px] border-black bg-zinc-100 px-4 py-2 text-sm font-bold text-black focus:outline-none focus:bg-orange-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left",
              triggerClassName
            )}
          >
            <span className="truncate">
              {selectedOption ? (selectedOption.displayLabel || selectedOption.label) : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100 text-black" strokeWidth={3} />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-0 border-[3px] border-black bg-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[100]"
          align="start"
        >
          <div className="flex items-center border-b-[3px] border-black px-3 bg-zinc-50">
            <Search className="mr-2 h-4 w-4 shrink-0 text-zinc-500" strokeWidth={2.5} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="flex h-10 w-full rounded-none bg-transparent py-3 text-sm font-bold outline-hidden placeholder:text-zinc-400 focus:outline-none"
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm font-bold text-zinc-500">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.key || `${option.value}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                    setSearch("")
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center justify-between px-3 py-2.5 text-sm font-bold outline-hidden hover:bg-orange-100 focus:bg-orange-100 text-left rounded-none border-b border-zinc-100 last:border-0",
                    option.value === value && "bg-orange-50 text-orange-600"
                  )}
                >
                  <span className="truncate flex-1">{option.label}</span>
                  {option.value === value && (
                    <Check className="ml-2 h-4 w-4 shrink-0 text-orange-600" strokeWidth={3} />
                  )}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
