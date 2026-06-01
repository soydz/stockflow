"use client"

import { Button } from "@/shared/components/ui";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/shared/components/ui/dialog";
import { Field, FieldGroup } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Spinner } from "@/shared/components/ui/spinner";
import { useState } from "react"
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormData, userFormSchema } from "../schemas/user.schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { createUserAction } from "../actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateUserForm() {
    const router = useRouter();

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const { handleSubmit, register, reset, control, formState: { errors, isSubmitting } } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "USER",
            enabled: true,
            deleted: false,
            avatar: null,
        }
    });

    const onSubmit = async (data: UserFormData) => {
        const { success, message } = await createUserAction(data);

        if (success) {
            toast.success(message, { position: "top-center" });

            // limpia formulario y cierra diálogo
            reset();
            setOpenDialog(false);

            // actualiza la página para ver el usuario creado
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
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Agregar usuarios</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                {...register("name")}
                                id="name"
                                required
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </Field>
                        <Field>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                {...register("email")}
                                id="email"
                                type="email"
                                required
                            />
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                        </Field>
                        <div className="flex gap-4">
                            <Field>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    required
                                />
                                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                            </Field>
                            <Field>
                                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                <Input
                                    {...register("confirmPassword")}
                                    id="confirmPassword"
                                    type="password"
                                    required
                                />
                                {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                            </Field>
                        </div>

                        <Field>
                            <Label htmlFor="role">Rol</Label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol"></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
                        </Field>
                        <Field>
                            <Label htmlFor="avatar">Avatar</Label>
                            <Input
                                {...register("avatar")}
                                id="avatar"
                                type="url"

                            />
                            {errors.avatar && <span className="text-xs text-red-500">{errors.avatar.message}</span>}
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