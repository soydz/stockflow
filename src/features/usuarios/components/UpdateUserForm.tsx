"use client"

import { Button } from "@/shared/components/ui";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/shared/components/ui/dialog";
import { Field, FieldGroup } from "@/shared/components/ui/field";
import { Label } from "@/shared/components/ui/label";
import { Spinner } from "@/shared/components/ui/spinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateData, userUpdateSchema } from "../schemas/user.schema";
import { Pencil } from "lucide-react";
import { updateUserAction } from "../actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UpdateUserFormProps {
    userId: string;
    emailUser: string;
    roleUser: "ADMIN" | "USER";
}

export function UpdateUserForm({ userId, emailUser, roleUser }: Readonly<UpdateUserFormProps>) {
    const router = useRouter();

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const { handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<UserUpdateData>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: {
            role: roleUser,
        }
    })

    useEffect(() => {
        reset({ role: roleUser });
    }, [roleUser, reset])

    const onSubmit = async (data: UserUpdateData) => {
        const { success, message } = await updateUserAction(userId, data);

        if (success) {
            toast.success(message, { position: "top-center" });

            // cierra el diálogo
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
                <Button variant="outline" onClick={() => setOpenDialog(true)}>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Editar el rol del usuario</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name">Email</Label>
                            <span>{emailUser}</span>
                        </Field>
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
                                    "Actualizar"
                                )
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}