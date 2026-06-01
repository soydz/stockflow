"use client"

import { MonthYearDates } from "@/shared/components/ui/MonthYearPicker";
import { useMemo } from "react";
import { TransactionResponse } from "../schemas/transaction.schema";
import { TinyBarChart } from "@/shared/components/ui/TinyBarChart";

// propiedades del objeto a graficar
export const CHART_CONFIG = [
    { key: "entradas", name: "Entradas", color: "#22c55e" },
    { key: "salidas", name: "Salidas", color: "#ef4444" },
];

interface TinyBarChartTransactionProps {
    transactions: TransactionResponse[];
    date: MonthYearDates;
}

export function TinyBarChartTransaction({ transactions, date }: Readonly<TinyBarChartTransactionProps>) {

    const chartData = useMemo(() => {
        // filtra transacciones por la fecha seleccionada
        const filtered = transactions.filter(t => {
            const d = new Date(t.createdAt);
            return d.getMonth() + 1 === date.month && d.getFullYear() === date.year;
        });

        // crea map para agrupar entradas y salidas por dias
        const daysMap: Record<string, {
            day: string,
            entradas: number,
            salidas: number,
        }> = {};

        // obtiene los dias del mes
        const daysInMonth = new Date(date.year, date.month, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const dayString = i.toString().padStart(2, "0");
            daysMap[i] = { day: dayString, entradas: 0, salidas: 0 }
        }

        // sumar cantidades segun el tipo
        filtered.forEach(t => {
            // padStart devuelve siempre 2 números, si no remplaza con cero
            const day = new Date(t.createdAt).getDate().toString().padStart(2, '0');

            if (daysMap[day]) {
                if (t.type === "ENTRADA") {
                    daysMap[day].entradas += t.quantity;
                } else {
                    daysMap[day].salidas += t.quantity;
                }
            }
        })

        // convierte el map en array para Recharts
        return Object.values(daysMap);
    }, [transactions, date]);

    return (
        <div className="py-4">
            <TinyBarChart
                data={chartData}
                config={CHART_CONFIG}
                xAxisKey="day"
                height="h-56"
            />
        </div>
    )
}