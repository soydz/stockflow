import { Sidebar } from "@/core/components/sidebar";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 p-4 mt-16 lg:pl-8 lg:ml-56 lg:mx-12 lg:mt-2 ">
                {children}
            </main>
        </div>
    )
}