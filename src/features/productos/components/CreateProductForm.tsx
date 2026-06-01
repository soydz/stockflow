"use client"

import { ProductFormData, productSchema } from "../schemas/product.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Field, FieldGroup } from "@/shared/components/ui/field"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui"
import { Resolver, useForm } from "react-hook-form";
import { Spinner } from "@/shared/components/ui/spinner"
import { useState } from "react"
import { createProductAction } from "../actions/product.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Textarea } from "@/shared/components/ui/textarea"

export function CreateProductForm() {
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
        defaultValues: {
            name: "",
            initialStock: 0,
            price: 0,
            description: "",
            image: "",
        }
    });

    const onSubmit = async (data: ProductFormData) => {
        const { success, message } = await createProductAction(data);

        // validación
        if (success) {
            toast.success(message, { position: "top-center" });

            // limpiar formulario
            reset();
            setOpenDialog(false);

            // actualiza la página para ver el producto creado
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
                        <DialogTitle>Agregar productos</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                {...register("name")}
                                id="name"
                                type="text"
                                required
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </Field>
                        <div className="flex flex-row gap-6">
                            <Field>
                                <Label htmlFor="initial-stock">Cantidad inicial</Label>
                                <Input
                                    {...register("initialStock")}
                                    id="initial-stock"
                                    type="number"
                                    required
                                />
                                {errors.initialStock && <span className="text-xs text-red-500">{errors.initialStock.message}</span>}
                            </Field>
                            <Field>
                                <Label htmlFor="initial-stock">Precio</Label>
                                <Input
                                    {...register("price")}
                                    id="price"
                                    type="number"
                                    required
                                />
                                {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
                            </Field>
                        </div>
                        <Field>
                            <Label htmlFor="name">Imagen</Label>
                            <Input
                                {...register("image")}
                                id="image"
                                type="text"
                                required
                            />
                            {errors.image && <span className="text-xs text-red-500">{errors.image.message}</span>}
                        </Field>
                        <Field>
                            <Label htmlFor="name">Decripción</Label>
                            <Textarea
                                {...register("description")}
                                id="description"
                                required
                            />
                            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">
                            {
                                isSubmitting ? (
                                    <Spinner />
                                ) : (
                                    "Crear"
                                )
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}