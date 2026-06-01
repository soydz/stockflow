"use server"

import prisma from "@/shared/lib/prisma";
import { TransactionFormData, transactionFormSchema, TransactionResponse } from "../schemas/transaction.schema";
import { getSession } from "@/shared/lib/auth";
import { revalidatePath } from "next/cache";

interface GetTransactionsByProductIdResponse {
    success: boolean;
    message: string;
    transactions: TransactionResponse[];
}

export async function getTransactionsByProductIdAction(productId: string): Promise<GetTransactionsByProductIdResponse> {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            include: {
                product: { select: { name: true } },
                responsible: { select: { name: true } },
            },
        });
        return {
            success: true,
            message: "",
            transactions
        }
    } catch {
        return {
            success: false,
            message: `Error al obtener las transacciones del producto: ${productId}`,
            transactions: [],
        }
    }
}

export async function createTransactionAction(data: TransactionFormData) {
    const session = await getSession();

    // valida sesión iniciada
    if (!session) {
        return {
            success: false,
            message: "Debes iniciar sesión para realizar esta acción",
        };
    }

    const validation = transactionFormSchema.safeParse(data);

    // no se cumple la validación
    if (!validation.success) {
        return {
            success: false,
            message: "Transacción inválida",
        }
    }

    try {
        // transacción atómica: crear transacción y descontar cantidad de producto
        await prisma.$transaction(async (tx) => {
            // si es salida, verifica stock suficiente
            if (data.type === "SALIDA") {
                const product = await tx.product.findUnique({
                    where: { id: data.productId },
                    select: { stock: true }
                });

                // error al realizar la transacción
                if (!product || product.stock < data.quantity) {
                    throw new Error("Stock insuficiente para realizar la salida");
                }
            }

            // crea la transacción
            await tx.transaction.create({
                data: {
                    type: data.type,
                    quantity: data.quantity,
                    enabled: true,
                    deleted: false,
                    productId: data.productId,
                    responsibleId: session.id,
                },
            });

            // actualiza stock del producto
            const stockAdjustment = data.type === "ENTRADA" ? data.quantity : -data.quantity;

            await tx.product.update({
                where: { id: data.productId },
                data: {
                    stock: {
                        increment: stockAdjustment
                    }
                }
            })
        });

        // actualiza la lista de transacciones
        revalidatePath("/transacciones");

        return {
            success: true,
            message: "Transacción registrada y stock actualizado",
        };
    } catch (e) {
        const error = e instanceof Error ? e.message : "Error al registrar la transacción";
        return {
            success: false,
            message: error
        }
    }
}
