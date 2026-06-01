"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui";
import { Controller } from "react-hook-form";

interface CustomerDetailsProps {
    control: any;
    errors: any;
    handleSubmit: any;
    disabled: boolean;
}

export function CustomerDetails({ control, errors, handleSubmit, disabled }: Readonly<CustomerDetailsProps>) {

    return (
        <Card className="p-6 md:p-8">
            <CardHeader className="p-0">
                <CardTitle className="text-3xl font-bold tracking-tight text-gray-800">Datos de envío</CardTitle>
            </CardHeader>
            <CardContent >
                <form onSubmit={handleSubmit()} className="p-0 space-y-4 mb-6">
                    <div className="space-y-3">
                        <Controller
                            name="name"
                            control={control}
                            disabled={disabled}
                            render={({ field }) =>
                                <>
                                    <Label htmlFor="name" className="text-lg font-medium text-gray-700">Nombre completo</Label>
                                    <Input
                                        {...field}
                                        id="name"
                                        placeholder="juan pérez"
                                        type="text"
                                        required
                                        className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </>
                            } />
                        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                    </div>

                    <div className="space-y-3">
                        <Controller
                            name="email"
                            control={control}
                            disabled={disabled}
                            render={({ field }) =>
                                <>
                                    <Label htmlFor="email" className="text-lg font-medium text-gray-700">Correo de contacto</Label>
                                    <Input
                                        {...field}
                                        id="email"
                                        placeholder="juan.perez@mail.com"
                                        type="email"
                                        required
                                        className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </>
                            } />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>

                    <div className="space-y-3">
                        <Controller
                            name="phone"
                            control={control}
                            disabled={disabled}
                            render={({ field }) =>
                                <>
                                    <Label htmlFor="phone" className="text-lg font-medium text-gray-700">Teléfono contacto</Label>
                                    <Input
                                        {...field}
                                        id="phone"
                                        placeholder="3129876543"
                                        type="number"
                                        required
                                        className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </>
                            } />

                        {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                    </div>

                    <div className="space-y-3">
                        <Controller
                            name="address"
                            control={control}
                            disabled={disabled}
                            render={({ field }) =>
                                <>
                                    <Label htmlFor="address" className="text-lg font-medium text-gray-700">Dirección de envío</Label>
                                    <Input
                                        {...field}
                                        id="address"
                                        placeholder="Calle 41 # 55-80"
                                        type="text"
                                        required
                                        className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </>
                            } />

                        {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
                    </div>

                    <div className="space-y-3 flex justify-between gap-6">
                        <div>
                            <Controller
                                name="city"
                                control={control}
                                disabled={disabled}
                                render={({ field }) =>
                                    <>
                                        <Label htmlFor="city" className="text-lg font-medium text-gray-700">Ciudad</Label>
                                        <Input
                                            {...field}
                                            id="city"
                                            placeholder="Medellín"
                                            type="text"
                                            required
                                            className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </>
                                } />

                            {errors.city && <span className="text-xs text-red-500">{errors.city.message}</span>}
                        </div>

                        <div>
                            <Controller
                                name="region"
                                control={control}
                                disabled={disabled}
                                render={({ field }) =>
                                    <>
                                        <Label htmlFor="region" className="text-lg font-medium text-gray-700">Departamento</Label>
                                        <Input
                                            {...field}
                                            id="region"
                                            placeholder="Antioquia"
                                            type="text"
                                            required
                                            className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </>
                                } />

                            {errors.region && <span className="text-xs text-red-500">{errors.region.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Controller
                            name="notes"
                            control={control}
                            disabled={disabled}
                            render={({ field }) =>
                                <>
                                    <Label htmlFor="notes" className="text-lg font-medium text-gray-700">Notas de entrega</Label>
                                    <Textarea
                                        {...field}
                                        id="notes"
                                        placeholder=""
                                        className="px-4 py-3 h-auto text-lg border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </>
                            } />

                        {errors.notes && <span className="text-xs text-red-500">{errors.notes.message}</span>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-xl font-semibold rounded-lg mt-2"
                        disabled={disabled}
                    >
                        Proceder con el pago
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}