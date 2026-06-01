'use server'

import { clearSession, setSession, signToken } from "@/shared/lib/auth";
import { LoginFormData, loginSchema } from "../schemas/login.schema";
import prisma from "@/shared/lib/prisma";
import bcrypt from "bcrypt"
import { UserResponse } from "@/features/usuarios/schemas/user.schema";


export type AuthResponse = {
    success: boolean;
    message: string;
    user: UserResponse | null;
}

export async function signInAction(data: LoginFormData): Promise<AuthResponse> {
    // validar datos con zod
    const validation = loginSchema.safeParse(data);

    // no se cumple la validación
    if (!validation.success) {
        return {
            success: false,
            message: "Credenciales inválidas",
            user: null,
        }
    }

    try {
        // busca el usuario por su email
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        // Valida credenciales
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            return {
                success: false,
                message: "Email o contraseña erróneos",
                user: null,
            }
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        // genera token
        const token = signToken(payload);

        // guarda el token en un Cookie segura
        await setSession(token);

        return {
            success: true,
            message: "Inicio de sesión exitoso",
            user: { ...user }
        }

    } catch {
        return {
            success: false,
            message: "Error del servidor",
            user: null,
        }
    }
}

export async function logoutAction() {
    try {
        await clearSession()
        return {
            success: true,
            message: "Sesión de usuario cerrada correctamente",
            user: null,
        }
    } catch {
        return {
            success: false,
            message: "Error al cerrar sesión",
            user: null,
        }
    }
}
