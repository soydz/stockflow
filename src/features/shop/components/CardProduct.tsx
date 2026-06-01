"use client"

import { Product } from "@/features/productos/schemas/product.schema";
import { Button } from "@/shared/components/ui";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { QuantityStepper } from "@/shared/components/ui/QuantityStepper";
import { Spinner } from "@/shared/components/ui/spinner";
import { formatThousands } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CardProductProps {
    product: Product;
}

export function CardProduct({ product }: Readonly<CardProductProps>) {
    const router = useRouter();

    const [quantity, setQuantity] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleBuy = async () => {
        setIsLoading(true);

        toast.success("Producto añadido", {
            description: "Te estamos redirigiendo al carrito para completar tu pago.",
            position: "top-center",
            duration: 2000,
        });

        // simula la conexión a la pasarela de pago, 2.5s
        await new Promise((resolve) => setTimeout(resolve, 2500));

        router.push(`/payment?productId=${product.id}&qty=${quantity}`);
    }

    return (
        <Card size="sm" className="mx-auto w-full p-2 md:flex md:flex-row lg:flex-col xl:flex-row">
            <div className="flex justify-center">
                <img
                    src={product.image}
                    alt="Imagen del producto"
                    className="object-contain max-w-72 w-full"
                />
            </div>
            <div className="flex flex-col justify-between gap-6 w-full">
                <CardHeader className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between w-full">
                        <CardTitle className="uppercase text-xl">{product.name}</CardTitle>
                        <CardAction>
                            <Badge variant="secondary" className="text-xl py-4 px-6">
                                $ {formatThousands(product.price)}
                            </Badge>
                        </CardAction>
                    </div>
                    <CardDescription className="w-full" >{product.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-row gap-4 justify-center">
                    <div className="">
                        <QuantityStepper
                            value={quantity}
                            onChange={setQuantity}
                            min={1}
                            max={product.stock}
                        />
                    </div>
                    <Button
                        id={product.id}
                        className="px-12 py-2" onClick={() => handleBuy()}>
                        {isLoading ? <Spinner /> : "Comprar"}
                    </Button>
                </CardFooter>
            </div>
        </Card>
    )
}