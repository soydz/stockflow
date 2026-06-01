import { CreateProductForm } from "@/features/productos/components/CreateProductForm";
import { TableProducts } from "@/features/productos/components/TableProducts";
import { getSession } from "@/shared/lib/auth";

export default async function Productos() {
    const session = await getSession();

    return (
        <div>
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-xl font-bold">Productos</h1>

                {session?.role === "ADMIN" && <CreateProductForm />}
            </div>
            <TableProducts />
        </div>
    )
}