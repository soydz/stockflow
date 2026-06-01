"use server"

import prisma from "@/shared/lib/prisma";
import { Product, ProductFormData, productPaymentSchema, productResponseSchema, productSchema } from "../schemas/product.schema";
import { getSession } from "@/shared/lib/auth";
import { revalidatePath } from "next/cache";
import z from "zod";


export type CreateProductResponse = {
    success: boolean;
    message: string;
}

export async function createProductAction(data: ProductFormData): Promise<CreateProductResponse> {
    const session = await getSession();

    // valida sesión iniciada
    if (!session) {
        return {
            success: false,
            message: "Debes iniciar sesión para realizar esta acción",
        };
    }

    // valida rol de administrador
    if (session?.role !== "ADMIN") {
        return {
            success: false,
            message: "No tienes permiso",
        };
    }

    const validation = productSchema.safeParse(data);

    // no se cumple la validación
    if (!validation.success) {
        return {
            success: false,
            message: "Producto inválido",
        }
    }

    try {
        await prisma.product.create({
            data: {
                name: data.name,
                initialStock: data.initialStock,
                stock: data.initialStock,
                price: data.price,
                description: data.description,
                image: data.image,
                creatorId: session?.id,
                enabled: true,
                deleted: false,
            },
        });

        // actualiza la lista de productos
        revalidatePath("/productos");

        return {
            success: true,
            message: "Producto creado exitosamente",
        };

    } catch {
        return {
            success: false,
            message: "Error al crear el producto"
        }
    }
}

export type GetProductResponse = {
    success: boolean;
    message: string;
    products: Product[] | null;
}

// obtener todos los productos es de libre acceso
export async function getProductsAction(): Promise<GetProductResponse> {
    try {
        const productsRaw = await prisma.product.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        // valida respuesta
        const products = z.array(productResponseSchema).safeParse(productsRaw);

        // no se cumple la validación
        if (!products.success) {
            return {
                success: false,
                message: "Productos inválidos",
                products: null,
            }
        }

        return {
            success: true,
            message: "Se obtienen los productos de forma satisfactoria",
            products: products.data,
        }
    } catch {
        return {
            success: false,
            message: "Error al obtener los productos",
            products: null,
        }
    }
}

export async function getProductByIdAction(id: string) {
    try {
        const productRaw = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                price: true,
            },
        });

        // validación respuesta
        const product = productPaymentSchema.safeParse(productRaw);

        // no se cumple la validación
        if (!product.success) {
            return {
                success: false,
                message: "Producto inválido",
                product: null,
            }
        }

        return {
            success: true,
            message: `Se obtiene el producto con id: ${id}`,
            product
        }

    } catch {
        return {
            success: false,
            message: "",
            product: null,
        };
    }
}