import Link from "next/link";

interface NavMenuContentProps {
    user: any;
    setIsSheetOpen: () => void;
    menuItems: any[];
}

export function NavMenuContent({ user, setIsSheetOpen, menuItems }: Readonly<NavMenuContentProps>) {

    const handleClick = () => {
        setIsSheetOpen();
    }

    return (
        <nav className="flex flex-col gap-1">
            {menuItems?.map((item) => {
                const hasAccess = item.role === "USER" || (item.role === "ADMIN" && user?.role === "ADMIN");
                const Icon = item.icon;
                return (hasAccess ? (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleClick}
                        className="flex items-center gap-3 px-4 py-4 hover:bg-gray-100 transition-colors"
                    >
                        <Icon size={20} />
                        <span>{item.name}</span>
                    </Link>
                ) : null
                );
            })}
        </nav>
    )
}