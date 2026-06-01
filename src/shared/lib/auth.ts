import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { getUserByIdAction } from "@/features/usuarios/actions/user.actions";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN_SEC = Number(process.env.JWT_EXPIRES_IN_SEC) || 3600;

export interface SessionPayload {
    id: string;
    role: "ADMIN" | "USER";
    email: string;
}

// crear token
export const signToken = (payload: object) => {
    if (!JWT_SECRET) throw new Error("JWT SECRET is not defined");

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN_SEC
    })
}

// verificar token - verifica que no esté modificado
export const verifyToken = (token: string) => {
    if (!JWT_SECRET) throw new Error("JWT SECRET is not defined");

    try {
        return jwt.verify(token, JWT_SECRET) as SessionPayload;
    } catch {
        return null;
    }
}

// guardar la cookie
export async function setSession(token: string) {
    (await cookies()).set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: JWT_EXPIRES_IN_SEC,
        path: "/"
    });
}

// leer los datos de la cookie y obtener los datos del usuario de DB
export async function getSession() {
    const token = (await cookies()).get("session")?.value;

    if (!token) return null;

    const payload = verifyToken(token);

    // validación de token válido para llamar a la bd
    if (!payload) return null;

    // obtenemos la información del usuario
    const response = await getUserByIdAction(payload.id);
    if (!response.success || !response.user) return null;
    return response.user;
}

// eliminar cookie
export async function clearSession() {
    (await cookies()).delete("session");
}