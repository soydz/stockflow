"use client"

import { useAuth } from "@/core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/components/ui/avatar";
import { ArrowLeftRight, Box, LogOut, LucideIcon, Menu, ShoppingCart, User, Users } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../../shared/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui";
import { useState } from "react";
import { NavMenuContent } from "./NavMenuContent";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";

interface ItemMenuProps {
    text: string;
    url: string;
    icon: LucideIcon;
}

interface SidebarProps {
    menu: ItemMenuProps[];
}

const MENU_ITEMS = [
    {
        name: 'Pedidos',
        href: '/pedidos',
        icon: ShoppingCart,
        role: 'USER'
    },
    {
        name: 'Inventario',
        href: '/productos',
        icon: Box,
        role: 'USER'
    },
    {
        name: 'Transacciones',
        href: '/transacciones',
        icon: ArrowLeftRight,
        role: 'USER'
    },
    {
        name: 'Usuarios',
        href: '/usuarios',
        icon: Users,
        role: 'ADMIN'
    },
];

export function Sidebar() {
    const router = useRouter();
    const { user, setUser } = useAuth();

    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const result = await logoutAction();

            if (result.success) {
                // limpiar el user del estado global
                setUser(null);

                toast.success(result.message, { position: "top-center" });

                // redirección al login
                router.push("/");
            }
        } catch {
            toast.error("Ocurrió un error inesperado", { position: "top-center" });
        }
    }

    return (
        <>
            {/* sidebar para escritorio */}
            <aside className="hidden max-w-60 py-4 bg-gray-50 border-r border-gray-100 lg:flex lg:fixed lg:flex-col lg:justify-between lg:h-full  ">
                <div className="flex flex-col gap-2">
                    <Link href="/productos">
                        <header className="text-xl px-4 py-2 font-bold text-green-700">StockFlow</header>
                    </Link>
                    <NavMenuContent
                        user={user}
                        setIsSheetOpen={() => setIsSheetOpen(false)}
                        menuItems={MENU_ITEMS}
                    />
                </div>
                {/* Avatar y Dropdown de usuario para escritorio */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-4 px-4 py-2 hover:cursor-pointer hover:bg-gray-100">
                            <Avatar size="lg">
                                <AvatarImage src={user?.avatar || ""} alt={user?.name || "User Avatar"} />
                                <AvatarFallback>
                                    {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span>{user?.name}</span>
                                <span>{user?.email}</span>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex justify-center text-red-500 hover:cursor-pointer" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </aside>
            {/* menú móvil  */}
            <div className="lg:hidden flex items-center  p-4 bg-gray-50 border-b border-gray-100 w-full fixed top-0 left-0 z-40">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Abrir menú">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="data-[side=left]:w-52 p-0 py-4 flex flex-col justify-between">
                        {/* contenido menú */}
                        <div className="flex flex-col gap-2 mt-8">
                            <NavMenuContent user={user} setIsSheetOpen={() => setIsSheetOpen(false)} menuItems={MENU_ITEMS}/>
                        </div>
                        {/* Avatar y Dropdown de usuario */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-4 px-4 py-2 hover:cursor-pointer hover:bg-gray-100">
                                    <Avatar size="lg">
                                        <AvatarImage src={user?.avatar || ""} alt={user?.name || "User Avatar"} />
                                        <AvatarFallback>
                                            {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span>{user?.name}</span>
                                        <span>{user?.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="56" side="right" align="start">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="text-red-500 hover:cursor-pointer" onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Cerrar sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SheetContent>
                </Sheet>

                <Link href="/productos" className="text-xl font-bold text-green-700">StockFlow</Link>
            </div>
        </>
    )

}