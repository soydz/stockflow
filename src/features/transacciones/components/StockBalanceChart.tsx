import { AppLineChart } from "@/shared/components/ui/AppLineChart";
import { TransactionResponse } from "../schemas/transaction.schema";
import { MonthYearDates } from "@/shared/components/ui/MonthYearPicker";
import { useMemo } from "react";
import { getInitialStockMonth } from "@/shared/lib/utils";

// propiedades del objeto a graficar
export const CHART_CONFIG = [
    { key: "balance", name: "Saldo", color: "#2b7fff", type: "monotone" as const},
];

interface StockBalanceChartProps {
    transactions: TransactionResponse[];
    initialStock: number;
    date: MonthYearDates;
}

export function StockBalanceChart({ transactions, initialStock, date }: Readonly<StockBalanceChartProps>) {

    const chartData = useMemo(() => {
        // ordena las transacciones por fecha ascendente
        const sorted = [...transactions].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // calcula el saldo al inicio del mes
        let balance = getInitialStockMonth(date, initialStock, sorted);

        // días del mes
        const daysInMonth = new Date(date.year, date.month, 0).getDate();

        const result: { day: string; balance: number }[] = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const dayStr = day.toString().padStart(2, "0");

            // transacciones ocurridas un día especifico
            for (const t of sorted) {
                const transactionDate = new Date(t.createdAt);
                
                if (transactionDate.getFullYear() === date.year &&
                    transactionDate.getMonth() + 1 === date.month &&
                    transactionDate.getDate() === day) {
                    balance += t.type === "ENTRADA" ? t.quantity : -t.quantity;
                }
            }
            result.push({ day: dayStr, balance });
        }
        return result;

    }, [transactions, date, initialStock]);

    return (
        <div className="py-4">
            <AppLineChart
                data={chartData}
                config={CHART_CONFIG}
                xAxisKey="day"
                height="h-56"
            />
        </div>
    )
}