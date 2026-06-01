import z from "zod";

export const transactionFormSchema = z.object({
    type: z.enum(["ENTRADA", "SALIDA"], {
        error: () => ({ message: "Seleccione un tipo de movimiento" }),
    }),
    quantity: z.coerce.number().int().min(1, { error: "La cantidad debe ser mayor a 0" }),
    productId: z.string().min(1, { error: "Debe seleccionar un producto" }),
});

export const transactionResponseSchema = transactionFormSchema.extend({
    id: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    product: z.object({
        name: z.string(),
    }).optional(),
    responsible: z.object({
        name: z.string(),
    }).optional(),
})

export type TransactionFormData = z.infer<typeof transactionFormSchema>;
export type TransactionResponse = z.infer<typeof transactionResponseSchema>;