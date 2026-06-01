import z from "zod";

export const OrderStatusEnum = z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]);
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export const orderSchema = z.object({
    quantity: z
        .number()
        .positive(),
    status: OrderStatusEnum,
    totalAmount: z
        .number()
        .positive(),
    shippingAmount: z
        .number()
        .nonnegative(),
    shippingNotes: z
        .string()
        .optional(),
    paymentDetails: z
        .string()
        .optional(),
    customerName: z
        .string(),
    customerEmail: z
        .string(),
    customerAddress: z
        .string(),
    customerPhone: z
        .string(),
    customerCity: z
        .string(),
    customerRegion: z
        .string(),
    unitPrice: z
        .number()
        .positive(),
    productName: z
        .string(),
    productId: z
        .string(),
})

export type OrderFormData = z.infer<typeof orderSchema>;

export const orderResponseSchema = orderSchema.extend({
    // se sobreescriben
    totalAmount: z
        .any()
        .transform(Number),
    shippingAmount: z
        .any()
        .transform(Number),
    unitPrice: z
        .any()
        .transform(Number),
    id: z
        .string(),
    createdAt: z
        .coerce
        .date(),
    updatedAt: z
        .coerce
        .date(),
    responsible: z.object({
        name: z.string(),
    }).nullish(),
})

export type Order = z.infer<typeof orderResponseSchema>;