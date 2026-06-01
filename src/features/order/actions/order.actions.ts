"use server"

import prisma from "@/shared/lib/prisma";
import { Order, OrderFormData, orderResponseSchema, orderSchema } from "../schemas/order.schema";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getSession } from "@/shared/lib/auth";

export async function proccessCheckoutAction(data: OrderFormData) {
    return await createOrderAction(data);

}

export async function createOrderAction(order: OrderFormData) {
    const validation = orderSchema.safeParse(order);

    // no se cumple la validación
    if (!validation.success) {
        return {
            success: false,
            message: "Pedido inválido",
        }
    }

    try {
        // transacción atómica
        await prisma.$transaction(async (tx) => {

            // valida stock disponible
            const product = await tx.product.findUnique({
                where: { id: order.productId },
                select: { stock: true }
            });

            // valida existencia del producto
            if (!product) throw new Error("Producto no encontrado");

            // valida stock disponible
            if (product.stock < order.quantity) {
                throw new Error(`Stock insuficiente. Disponible: ${product.stock}, solicitado: ${order.quantity}`);
            }

            // se guarda el pedido
            await tx.order.create({
                data: {
                    quantity: order.quantity,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    shippingAmount: order.shippingAmount,
                    shippingNotes: order.shippingNotes ? order.shippingNotes : "",
                    paymentDetails: order.paymentDetails,
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    customerAddress: order.customerAddress,
                    customerPhone: order.customerPhone,
                    customerCity: order.customerCity,
                    customerRegion: order.customerRegion,
                    unitPrice: order.unitPrice,
                    productName: order.productName,
                    productId: order.productId,
                },
            });
        })

        // actualiza la lista de pedidos para reflejar los nuevos
        revalidatePath("/pedidos");

        return {
            success: true,
            message: "Pedido creado exitosamente",
        };

    } catch {
        return {
            success: false,
            message: "Error al crear el pedido"
        }
    }
}

export async function getOrdersAction() {
    try {
        const ordersRaw = await prisma.order.findMany({
            orderBy: {
                createdAt: "asc"
            },
            include: {
                responsible: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // validar respuesta
        const orders = z.array(orderResponseSchema).safeParse(ordersRaw);

        // no se cumple la validación
        if (!orders.success) {
            return {
                success: false,
                message: "Pedidos inválidos",
                orders: null,
            }
        }

        return {
            success: true,
            message: "Se obtienen los pedidos correctamente",
            orders: orders.data,
        }
    } catch {
        return {
            success: false,
            message: "Error al obtener los pedidos",
            orders: null,
        }
    }
}

export async function updateOrderStatus(order: Order) {
    const session = await getSession();

    // valida sesión iniciada
    if (!session) {
        return {
            success: false,
            message: "Debes iniciar sesión para realizar esta acción",
        };
    }

    try {
        await prisma.$transaction(async (tx) => {
            // validación de stock
            const product = await tx.product.findUnique({
                where: { id: order.productId },
                select: { stock: true }
            });

            if (!product || product.stock < order.quantity) {
                throw new Error("Stock insuficiente para realizar la salida");
            }

            // actualiza el estado del pedido y asigna responsable
            await tx.order.update({
                where: { id: order.id },
                data: {
                    status: order.status,
                    responsibleId: session.id,
                },
            });

            // actualiza el stock
            await tx.product.update({
                where: { id: order.productId },
                data: {
                    stock: {
                        decrement: order.quantity,
                    }
                }
            });

            // crea la transacción
            await tx.transaction.create({
                data: {
                    type: "SALIDA",
                    quantity: order.quantity,
                    enabled: true,
                    deleted: false,
                    productId: order.productId,
                    responsibleId: session.id,
                }
            });

        })


        // actualiza la vista del pedido
        revalidatePath("/pedidos");
        // actualiza la lista de transacciónes
        revalidatePath("/transacciones");
        // actualiza productos
        revalidatePath("/productos")

        return {
            success: true,
            message: "Pedido actualizado exitosamente",
        };

    } catch {
        return {
            success: false,
            message: "Error al actualizar el pedido"
        }
    }
}
