import { getProductsAction } from "@/features/productos/actions/product.actions";
import { TransactionsContainer } from "@/features/transacciones/components/TransactionsContainer";


export default async function Transacciones() {
    const { success, message, products } = await getProductsAction();

    if (!success || !products) {
        return (
            <div className="text-center text-red-500">
                {message}
            </div>
        )
    }

    return (
        <div>
            <TransactionsContainer products={products} />
        </div>
    )
}