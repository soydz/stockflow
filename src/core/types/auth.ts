import { UserResponse } from "@/features/usuarios/schemas/user.schema";

export interface AuthContextType {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: UserResponse | null) => void;
}
