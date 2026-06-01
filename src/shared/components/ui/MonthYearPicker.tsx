"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Label } from "./label";
import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

export interface MonthYearDates {
  month: number;
  year: number;
}

interface MonthYearPickerProps {
  value: MonthYearDates;
  onChange: (date: MonthYearDates) => void;
  label?: string;
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function MonthYearPicker({
  value,
  onChange,
  label,
}: Readonly<MonthYearPickerProps>) {

  // controlar el año
  const [viewYear, setViewYear] = useState(value.year);
  // apertura del modal
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMonthSelect = (monthIndex: number) => {
    onChange({
      month: monthIndex + 1,
      year: viewYear,
    });

    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <Label className="text-muted-foreground text-xs uppercase tracking-widest">
          {label}
        </Label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-35 justify-between font-serif"
          >
            {`${MONTHS[value.month - 1]} ${value.year}`}
            <ChevronDown size={16} className="ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex items-center justify-between mb-6 px-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewYear((prev) => prev - 1)}
            >
              <ChevronLeft size={18} />
            </Button>

            <span className="text-lg">{viewYear}</span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewYear((prev) => prev + 1)}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => {
              const isSelected =
                value.month === index + 1 && value.year === viewYear;
              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className=""
                  onClick={() => handleMonthSelect(index)}
                >
                  {month.substring(0, 3)}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}