import { verifyToken } from "@/shared/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    const payload = token ? verifyToken(token) : null;

    const authRoutes = ["/", "/login", "/payment"];

    const isAuthRoute = authRoutes.includes(pathname);
    const isAdminRoute = pathname.startsWith("/usuarios");

    // token inválido y no es ruta de autenticación
    if (!payload && !isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // credenciales correctas, no necesita login
    if (payload && isAuthRoute && pathname !== "/") {
        return NextResponse.redirect(new URL("/productos", request.url));
    }

    // control de roles
    if (isAdminRoute && payload?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/productos", request.url));
    }

    return NextResponse.next();
}

// excluye contenido estático
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};