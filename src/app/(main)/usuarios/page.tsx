import { CreateUserForm } from "@/features/usuarios/components/CreateUserForm";
import { TableUsers } from "@/features/usuarios/components/TableUsers";

export default function Usuarios() {
    return (
        <div>
            <div className="flex flex-row justify-between">
                <h1 className="text-xl font-bold">Usuarios</h1>
                <CreateUserForm />
            </div>
            <TableUsers />
        </div>
    )
}