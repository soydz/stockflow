import z from "zod"

export const productSchema = z.object({
    name: z
        .string()
        .trim()
        .toLowerCase()
        .min(2, { error: "Debe tener más de 2 caracteres" })
        .max(100, { error: "Máximo 100 caracteres" }),
    initialStock: z
        .coerce
        .number()
        .int({ error: "Debe ser un número entero" })
        .positive({ error: "Debe ser mayor que 0" }),
    price: z
        .coerce
        .number({ error: "Precio es requerido" })
        .positive({ error: "Debe ser mayor que 0" }),
    description: z
        .string()
        .toLowerCase()
        .max(1000, { error: "Máximo 1000 caracteres" }),
    image: z
        .string()
        .min(3, { error: "Imagen obligatoria" })
})

export type ProductFormData = z.infer<typeof productSchema>;


export const productCreatorSchema = z.object({
    id: z.string({ error: "Id es requerido" }),
    name: z.string({ error: "Nombre es requerido" }),
    email: z.email({ error: "Correo es requerido" }),
})

export const productResponseSchema = productSchema.extend({
    // se sobreescribe
    price: z
        .any()
        .transform(Number),
    id: z
        .string(),
    stock: z
        .number()
        .int()
        .nonnegative(),
    createdAt: z
        .coerce
        .date(),
    updatedAt: z
        .coerce
        .date(),
    enabled: z
        .boolean(),
    deleted: z
        .boolean(),
    creatorId: z
        .string(),
    creator: productCreatorSchema,
})

export type Product = z.infer<typeof productResponseSchema>;

export const productPaymentSchema = z.object({
    price: z
        .any()
        .transform(Number),
    id: z
        .string(),
    name: z.string()
})

export type ProductPayment = z.infer<typeof productPaymentSchema>