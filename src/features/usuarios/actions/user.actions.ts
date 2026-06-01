"use server"

import prisma from "@/shared/lib/prisma";
import { UserFormData, userFormSchema, UserResponse, UserUpdateData, userUpdateSchema } from "../schemas/user.schema";
import { getSession } from "@/shared/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt"

export type GetUserByIdResponse = {
    success: boolean;
    message: string;
    user: UserResponse | null;
}

export async function getUserByIdAction(id: string): Promise<GetUserByIdResponse> {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                avatar: true,
                enabled: true,
                deleted: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return {
            success: true,
            message: "",
            user: user,
        }
    } catch {
        return {
            success: false,
            message: "",
            user: null,
        };
    }

}

export type GetUsersResponse = {
    success: boolean;
    message: string;
    users: UserResponse[] | null;
}

export async function getUsersAction(): Promise<GetUsersResponse> {
    try {
        const users = await prisma.user.findMany();

        return {
            success: true,
            message: "",
            users: users,
        }
    } catch {
        return {
            success: false,
            message: "",
            users: null,
        };
    }
}

export async function createUserAction(data: UserFormData) {
    const session = await getSession();

    // valida sesión iniciada
    if (!session) {
        return {
            success: false,
            message: "Debes iniciar sesión para realizar esta acción",
        };
    }

    const validation = userFormSchema.safeParse(data);

    // no se cumple la validación
    if (!validation.success) {
        return {
            success: false,
            message: "Usuario inválido",
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                avatar: data.avatar,
                enabled: data.enabled,
                deleted: data.deleted
            },
        });

        // actualiza lista de usuarios
        revalidatePath("/usuarios");

        return {
            success: true,
            message: "Usuario creado exitosamente",
        };

    } catch {
        return {
            success: false,
            message: "Error al crear el usuario"
        }
    }
}

export async function updateUserAction(id: string, data: UserUpdateData) {
    const session = await getSession();

    // valida sesion iniciada
    if (!session) {
        return {
            success: false,
            message: "Debes iniciar sesión para realizar esta acción",
        };
    }

    const validation = userUpdateSchema.safeParse(data);

    // no se cumple la validación
    if (!validation.success) {
        return {
            success: false,
            message: "Datos inválidos",
        }
    }

    try {
        await prisma.user.update({
            where: { id },
            data: validation.data,
        });

        // actualiza lista de usuarios
        revalidatePath("/usuarios");

        return {
            success: true,
            message: "Usuario actualizado exitosamente",
        };

    } catch {
        return {
            success: false,
            message: "Error al actualizar el usuario"
        }
    }

}