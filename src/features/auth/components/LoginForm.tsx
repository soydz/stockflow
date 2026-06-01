'use client'

import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { signInAction } from "../actions/auth.actions";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui";


import { LoginFormData, loginSchema } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Spinner } from "@/shared/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/hooks/useAuth";


export function LoginForm() {
    const router = useRouter();
    const {setUser} = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // cuando se envía el formulario
    const onSubmit = async (data: LoginFormData) => {
        // ejecuta el action para generar el login con la bd
        const { success, message, user } = await signInAction(data);
        

        // validación
        if (success && user) {
            setUser(user);

            router.push("/productos");
            toast.success(message, { position: "top-center" });

        } else {
            toast.error(message, { position: "top-center" });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="jhon@mail.com"
                        required
                    />
                    {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    <Input
                        {...register("password")}
                        id="password"
                        type="password"
                        required
                    />
                    {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                </Field>

                <Field>
                    <Button type="submit">
                        {isSubmitting ? (
                            <Spinner />
                        ) : (
                            "Iniciar"
                        )}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}