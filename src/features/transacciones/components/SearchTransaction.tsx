"use client"

import { Product } from "@/features/productos/schemas/product.schema";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/shared/components/ui/combobox";
import { useMemo } from "react";

interface SearchTransactionProps {
    products: Product[];
    value: string;
    onSelect: (product: Product) => void;
}

export function SearchTransaction({ products, value, onSelect }: Readonly<SearchTransactionProps>) {
    // busca el nombre del producto usando su id
    const selectedProductName = useMemo(() => {
        return products.find(p => p.id === value)?.name || "";
    }, [products, value])

    return (
        <Combobox
            items={products.map(p => p.name)}
            value={selectedProductName}
            onValueChange={(name) => {
                
                const product = products.find(p => p.name === name)

                // seteamos el id al estado global
                product && onSelect(product);
            }}
            autoHighlight
        >
            <ComboboxInput placeholder="Selecciona el producto" />
            <ComboboxContent>
                <ComboboxEmpty>No se encontraron productos</ComboboxEmpty>
                <ComboboxList>
                    {(itemName) => {
                        const product = products.find(p => p.name === itemName)
                        if (!product) return null;

                        return (
                            <ComboboxItem key={product?.id} value={product?.name}>
                                {product?.name}
                            </ComboboxItem>
                        )
                    }}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}