import { TransactionResponse } from "@/features/transacciones/schemas/transaction.schema";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MonthYearDates } from "../components/ui/MonthYearPicker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-Co", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("es-Co", {
    second: "2-digit",
    minute: "2-digit",
    hour: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

// calcula el saldo al inicio del mes
export const getInitialStockMonth = (date:MonthYearDates , initialStock: number, sorted: TransactionResponse[]) => {
  let balance = initialStock;
  for (const t of sorted) {
    const transactionDate = new Date(t.createdAt);
    // transacciones anteriores al mes seleccionado
    if (transactionDate.getFullYear() < date.year ||
      (transactionDate.getFullYear() === date.year && transactionDate.getMonth() + 1 < date.month)) {
      balance += t.type === "ENTRADA" ? t.quantity : -t.quantity;
    }
  }

  return balance;
}


export function formatThousands(val: number | string) {
    if (val === undefined || val === null || val === "") return "";
    // Convertimos a string y agregamos el punto cada 3 dígitos
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};