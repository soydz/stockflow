"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Order, OrderStatus } from "../schemas/order.schema";
import { Badge } from "@/shared/components/ui/badge";
import { formatDateTime } from "@/shared/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { updateOrderStatus } from "../actions/order.actions";
import { toast } from "sonner";

const OrderStatusColor = {
    PENDING: "bg-gray-200",
    PAID: "bg-gray-500",
    PROCESSING: "bg-blue-500",
    SHIPPED: "bg-yellow-500",
    DELIVERED: "bg-green-700",
    CANCELLED: "bg-red-500",
    REFUNDED: "bg-orange-500",
}

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: Readonly<OrderCardProps>) {

    const handleUpdateStatus = async (value: OrderStatus) => {
        const newOrder = {
            ...order,
            status: value,
        }
        const { success, message } = await updateOrderStatus(newOrder);

        if (success) {
            toast.success(message, { position: "top-center" })
        } else {
            toast.error(message, { position: "top-center" })
        }
    }

    return (
        <Card className="text-lg">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{order.id}</span>
                    <Badge className={order.status ? OrderStatusColor[order.status] : "bg-white"}>{order.status}</Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                    <span>{formatDateTime(order.createdAt)}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* producto */}
                <div className="flex flex-col gap-1 p-2">
                    <span>Producto: {order.productId}</span>
                    <div className="flex flex-row gap-6 justify-between">
                        <span className="font-semibold">{order.productName}</span>
                        <span className="font-semibold">Cantidad: {order.quantity}</span>
                    </div>
                </div>

                {/* cliente */}
                <div className="flex flex-col gap-1 p-2">
                    <div className="flex flex-row gap-6 justify-between">
                        <span>{order.customerName}</span>
                        <span>tel: {order.customerPhone}</span>
                    </div>
                    <span className="font-semibold">{order.customerAddress}, {order.customerCity}, {order.customerRegion}</span>
                    <span>{order.shippingNotes}</span>
                </div>

                {/* empleado responsable */}
                {order.responsible && (
                    <div>
                        <span className="font-semibold">Responsable: </span>
                        <span>{order.responsible.name}</span>
                    </div>
                )}

                <Select defaultValue={order.status} onValueChange={(value) => handleUpdateStatus(value as OrderStatus)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Estado</SelectLabel>
                            <SelectItem key="PAID" value="PAID">PAID</SelectItem>
                            <SelectItem key="PROCESSING" value="PROCESSING">PROCESSING</SelectItem>
                            <SelectItem key="SHIPPED" value="SHIPPED">SHIPPED</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

            </CardContent>
        </Card>
    )
}
