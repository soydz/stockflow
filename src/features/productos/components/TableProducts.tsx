import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { getProductsAction } from "../actions/product.actions";

export async function TableProducts() {
    const { success, message, products } = await getProductsAction();

    return (
        <>
            {success ? (
                <div>
                    <Table>
                        <TableCaption>Lista de productos</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-16">Id</TableHead>
                                <TableHead>Producto</TableHead>
                                <TableHead>Saldo</TableHead>
                                <TableHead>Creador</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="break-all md:break-normal">{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>{product.creator.name}</TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-4">
                    <span className="text-md text-red-500">{message}</span>
                </div>
            )}
        </>
    )
}