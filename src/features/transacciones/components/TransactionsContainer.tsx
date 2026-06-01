"use client"

import { Product } from "@/features/productos/schemas/product.schema";
import { useEffect, useState } from "react";
import { SearchTransaction } from "./SearchTransaction";
import { CreateTransactionForm } from "./CreateTransactionForm";
import { TableTransactions } from "./TableTransactions";
import { TransactionResponse } from "../schemas/transaction.schema";
import { getTransactionsByProductIdAction } from "../actions/transaction.actions";
import { TinyBarChartTransaction } from "./TinyBarChartTransaction";
import { MonthYearDates, MonthYearPicker } from "@/shared/components/ui/MonthYearPicker";
import { StockBalanceChart } from "./StockBalanceChart";

interface TransactionContainerProps {
    products: Product[];
}

export function TransactionsContainer({ products }: Readonly<TransactionContainerProps>) {
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [date, setDate] = useState<MonthYearDates>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });


    useEffect(() => {
        async function loadTransactions() {
            if (!selectedProduct) {
                setTransactions([]);
                return;
            }

            setTransactions([]);
            setIsLoading(true);
            const { success, transactions } = await getTransactionsByProductIdAction(selectedProduct.id);

            if (success && transactions) {
                setTransactions(transactions);
            }

            setIsLoading(false);
        }

        loadTransactions();
    }, [selectedProduct, refreshKey]);

    const handleTransactionSuccess = () => {
        setRefreshKey((prev) => prev + 1);
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl">Transacciones</h1>
                <div className="flex justify-between">
                    <SearchTransaction
                        products={products}
                        value={selectedProduct?.id || ""}
                        onSelect={setSelectedProduct}
                    />

                    <CreateTransactionForm product={selectedProduct} onSuccess={handleTransactionSuccess} />
                </div>
            </div>

            <div>
                <TableTransactions
                    productId={selectedProduct?.id}
                    transactions={transactions}
                    isLoading={isLoading}
                />

            </div>
            <div>
                {transactions.length > 0 && (
                    <div>
                        <div className="flex">
                            <MonthYearPicker
                                value={date}
                                onChange={(date) => setDate(date)}
                            />
                        </div>
                        <div>
                            <StockBalanceChart
                                transactions={transactions}
                                initialStock={selectedProduct?.initialStock ?? 0}
                                date={date}
                            />

                            <TinyBarChartTransaction
                                transactions={transactions}
                                date={date}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
