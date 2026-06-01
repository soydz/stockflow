"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  onPaymentComplete: (id: string) => void;
}

export function PaymentForm({ onPaymentComplete }: Readonly<PaymentFormProps>) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const handleConfirmPurchase = (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // simula el procesamiento del pago
    setTimeout(async () => {
      // id del pago simulado
      await onPaymentComplete(crypto.randomUUID());

      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleReturnToShop = () => {
    router.push("/productos");
  };

  return (
    <Card className="p-6 md:p-8 shadow-lg border-gray-100 bg-white">
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-3xl font-bold tracking-tight text-gray-800">Detalles de Pago</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle2 className="h-24 w-24 text-green-500 mb-6" />
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">¡Pago Realizado con éxito!</h2>
            <p className="text-lg text-gray-600 mb-8">Tu pedido ha sido realizado.</p>
            <Button onClick={handleReturnToShop} className="px-8 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              Volver a la Tienda
            </Button>
          </div>
        ) : (
          <form onSubmit={handleConfirmPurchase} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="card-number" className="text-lg font-medium text-gray-700">Número de tarjeta</Label>
              <div className="relative">
                <Input
                  id="card-number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  required
                  className="pl-12 pr-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="cardholder-name" className="text-lg font-medium text-gray-700">Nombre del titular</Label>
              <Input
                id="cardholder-name"
                placeholder="Juan Pérez"
                required
                className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <Label htmlFor="expiry-date" className="text-lg font-medium text-gray-700">Fecha de caducidad</Label>
                <Input
                  id="expiry-date"
                  placeholder="MM / AA"
                  required
                  className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1 space-y-3">
                <Label htmlFor="cvc" className="text-lg font-medium text-gray-700">CVC/CVV</Label>
                <Input
                  id="cvc"
                  placeholder="XXX"
                  required
                  className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

            </div>

            <Button
              onSubmit={handleConfirmPurchase}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-xl font-semibold text-white rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              {isLoading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
              {isLoading ? "Procesando..." : "Confirmar Compra"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}