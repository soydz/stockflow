"use client"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Field, FieldGroup } from "@/shared/components/ui/field"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui"
import { useEffect, useState } from "react"
import { Controller, Resolver, useForm } from "react-hook-form"
import { Spinner } from "@/shared/components/ui/spinner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { TransactionFormData, transactionFormSchema } from "../schemas/transaction.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@/features/productos/schemas/product.schema"
import { createTransactionAction } from "../actions/transaction.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CreateTransactionFormProps {
    product?: Product;
    onSuccess: () => void;
}

export function CreateTransactionForm({ product, onSuccess }: Readonly<CreateTransactionFormProps>) {
    const router = useRouter();

    // controla apertura del diálogo
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const { handleSubmit, register, reset, control, setValue, formState: { errors, isSubmitting } } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionFormSchema) as Resolver<TransactionFormData>,
        defaultValues: {
            productId: product?.id || "",
            type: "" as any,
            quantity: "" as any,
        }
    });

    // sincroniza el ID cuando cambia
    useEffect(() => {
        if (product?.id) {
            setValue("productId", product.id);
        }
    }, [product]);

    const onSubmit = async (data: TransactionFormData) => {
        const { success, message } = await createTransactionAction(data);

        if (success) {
            toast.success(message, { position: "top-center" });

            // para actualizar la tabla
            onSuccess();

            // limpiar formulario - no borra el productId
            reset({
                ...data,
                type: "" as any,
                quantity: "" as any,
            });
            setOpenDialog(false);

            // actualiza la página para ver la transacción creada
            router.refresh();

        } else {
            toast.error(message, { position: "top-center" });
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpenDialog(true)}>Agregar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Agregar movimiento</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>

                    {/* input oculto para registrar el ID del producto*/}
                    <input type="hidden" {...register("productId")} />

                    {!product && <span className="text-red-500">Selecciona un producto primero</span>}
                    {product &&
                        <FieldGroup>
                            <Field>
                                <Label>Producto</Label>
                                <span>{product.name}</span>
                            </Field>

                            <Field>
                                <Label htmlFor="type">Tipo</Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el tipo de movimiento"></SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="ENTRADA">Entrada</SelectItem>
                                                    <SelectItem value="SALIDA">Salida</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.type && <span className="text-xs text-red-500">{errors.type.message}</span>}
                            </Field>

                            <Field>
                                <Label htmlFor="quantity">Cantidad</Label>
                                <Input
                                    {...register("quantity")}
                                    id="quantity"
                                    type="number"
                                    placeholder="0"
                                    required
                                />
                                {errors.quantity && <span className="text-xs text-red-500">{errors.quantity.message}</span>}
                            </Field>
                        </FieldGroup>
                    }

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        {product &&
                            <Button type="submit">
                                {
                                    isSubmitting ? (
                                        <Spinner />
                                    ) : (
                                        "Crear"
                                    )
                                }
                            </Button>
                        }
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}