import z from "zod"

export const customerDetailsSchema = z.object({
    name: z
        .string()
        .toLowerCase()
        .min(3, { error: "Debe tener más de 3 caracteres" }),
    email: z
        .email({ error: "Correo inválido" })
        .toLowerCase(),
    phone: z
        .string({ error: "Es requerido" }),
    address: z
        .string()
        .min(4, { error: "Es requerida" }),
    city: z
        .string()
        .min(2, { error: "Es requerida" }),
    region: z
        .string()
        .min(2, { error: "Es requerida" }),
    notes: z
        .string()
        .max(500, { error: "Maximo 500 caracteres"})
        .optional(),
})

export type CustomerDetailsFormData = z.infer<typeof customerDetailsSchema>;