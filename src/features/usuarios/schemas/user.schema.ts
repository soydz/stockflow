import z from "zod"

export const userSchemaBase = z.object({
    name: z.string().trim().min(1, "El nombre es requerido"),
    email: z.email({ error: "Correo inválido" }).toLowerCase(),
    role: z.enum(["ADMIN", "USER"]),
    avatar: z.string().optional().nullable(),
    enabled: z.boolean(),
    deleted: z.boolean(),
});

export const userFormSchema = userSchemaBase.extend({
    password: z.string()
        .min(8, { error: "Contraseña debe ser mayor o igual a 8 caracteres" })
        .regex(/[A-Z]/, { error: "Debe contener una letra mayúscula" })
        .regex(/[a-z]/, { error: "Debe contener una letra minúscula" })
        .regex(/\d/, { error: "Debe contener un número" })
        .regex(/[^A-Za-z0-9]/, { error: "Debe contener un carácter especial" }),
    confirmPassword: z.string().min(1, { error: "Por favor confirma la contraseña" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Contraseñas no coinciden",
    path: ["confirmPassword"],
});

export const userResponseSchema = userSchemaBase.extend({
    id: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const userUpdateSchema = userSchemaBase.partial();

export type UserFormData = z.infer<typeof userFormSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;