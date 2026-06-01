"use client"

import { createContext, ReactNode, useMemo, useState } from "react";
import { AuthContextType } from "../types/auth";
import { UserResponse } from "@/features/usuarios/schemas/user.schema";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialUser }: Readonly<{ children: ReactNode, initialUser: UserResponse | null }>) {
    const [user, setUser] = useState<UserResponse | null>(initialUser);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authValue = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser
    }), [user, isLoading])

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }