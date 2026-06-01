"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { formatDate } from "@/shared/lib/utils";
import { TransactionResponse } from "../schemas/transaction.schema";
import { Spinner } from "@/shared/components/ui/spinner";
import { Badge } from "@/shared/components/ui/badge";

interface TableTransactionProps {
    productId?: string;
    transactions: TransactionResponse[];
    isLoading: boolean;
}

export function TableTransactions({ productId, transactions, isLoading, }: Readonly<TableTransactionProps>) {

    // si no hay producto seleccionado, la tabla no se muestra
    if (!productId) return <div className="text-center text-muted-foreground">Seleccione un producto para ver sus movimientos</div>
    // spinner de carga
    if (isLoading) return <div className="flex justify-center"><Spinner /></div>

    return (
        <Table>
            <TableCaption>Lista de transacciones</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-16">Id</TableHead>
                    <TableHead className="whitespace-normal wrap-break-word">Fecha de creación</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="whitespace-normal wrap-break-word">Usuario ejecutor</TableHead>
                    <TableHead className="w-14">Operación</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">No hay movimientos</TableCell>
                    </TableRow>
                ) : (
                    transactions?.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="break-all md:break-normal">{transaction.id}</TableCell>
                            <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                            <TableCell>{transaction.quantity}</TableCell>
                            <TableCell>{transaction.responsible?.name}</TableCell>
                            <TableCell>
                                <Badge variant={transaction.type === "ENTRADA" ? "default" : "destructive"}>
                                    {transaction.type}
                                </Badge>
                            </TableCell>

                        </TableRow>
                    ))
                )}

            </TableBody>
        </Table>
    )
}