import { getOrdersAction } from "@/features/order/actions/order.actions"
import { OrderCard } from "@/features/order/components/OrderCard";

export default async function Pedidos() {
    const { success, message, orders } = await getOrdersAction();

    if (!success) {
        console.log(message)
    }

    if (success && orders?.length === 0) {
        return (
            <div>
                <span>No hay pedidos</span>
            </div>
        )
    }

    return (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {orders?.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    )
}