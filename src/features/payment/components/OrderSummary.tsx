"use client";

import { CheckoutType } from "@/app/(auth)/payment/page";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatThousands } from "@/shared/lib/utils";

interface OrderSummaryProps {
  checkout: CheckoutType;
  subtotal: number;
  shipping: number;
  total: number;
}

export function OrderSummary({ checkout, subtotal, shipping, total } : Readonly<OrderSummaryProps>) {

  return (
    <Card className="p-6 md:p-8 border-none shadow-none bg-gray-50/50">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-3xl font-bold tracking-tight text-gray-800">Tu Resumen de pedido</CardTitle>
        <CardDescription className="text-gray-600">Revisa los detalles de tu compra antes de finalizar.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-700">
            <span className="font-medium uppercase">{checkout.productName}</span>
            <span>$ {formatThousands(checkout.price)}</span>
          </div>
        </div>
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center text-gray-700">
            <span>Cantidad</span>
            <span className="font-medium">{checkout.quantity}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>Subtotal</span>
            <span className="font-medium">${formatThousands(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>Envío</span>
            <span className="font-medium">$ {formatThousands(shipping)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t-2 border-gray-200 pt-6">
        <div className="flex justify-between items-center w-full text-3xl font-bold text-gray-900">
          <span>Total</span>
          <span>${formatThousands(total)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}