import z from "zod"

export const loginSchema = z.object({
    email: z
        .email({ error: "Dirección de email inválida" })
        .trim()
        .toLowerCase()
        .min(1, { error: "Email es requerido" }),
    password: z.
        string()
        .min(8, { error: "La contraseña debe tener mínimo 8 caracteres" })
});

export type LoginFormData = z.infer<typeof loginSchema>;