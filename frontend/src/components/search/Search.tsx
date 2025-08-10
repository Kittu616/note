"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import symbols from "../../utils/symbols.json" 
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"

type LatexSymbol = { name: string; latex: string; symbol: string }
type SymbolsData = Record<string, LatexSymbol[]>

export function SymbolCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [search, setSearch] = React.useState("")

  const symbolsData = symbols as SymbolsData

  // Filter logic: if search matches a group name -> return whole group
  // If matches individual name -> only that item
  const filtered = React.useMemo(() => {
    if (!search) return symbolsData

    const lower = search.toLowerCase()
    const result: SymbolsData = {}

    for (const group in symbolsData) {
      if (group.toLowerCase().includes(lower)) {
        // whole group
        result[group] = symbolsData[group]
      } else {
        // filter within group
        const matches = symbolsData[group].filter((s) =>
          s.name.toLowerCase().includes(lower)
        )
        if (matches.length) result[group] = matches
      }
    }
    return result
  }, [search, symbolsData])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between hover:text-white"
        >
          {value || "Select symbol..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200%] p-0">
        <Command>
          <CommandInput
            placeholder="Search symbol or group..."
            className="h-9"
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No symbol found.</CommandEmpty>
            {Object.entries(filtered).map(([group, items]) => (
              <CommandGroup key={group} heading={group}>
                {items.map((item) => (
                  <CommandItem
                    key={item.latex}
                    value={item.name}
                    onSelect={() => {
                      setValue(`${item.symbol} (${item.latex})`)
                      setOpen(false)
                    }}
                  >
                    <span className="mr-2">{item.symbol}</span>
                    {item.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value.includes(item.latex) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
