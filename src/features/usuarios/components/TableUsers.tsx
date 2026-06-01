import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/shared/components/ui/table";
import { getUsersAction } from "../actions/user.actions";
import { formatDate } from "@/shared/lib/utils";
import { UpdateUserForm } from "./UpdateUserForm";

export async function TableUsers() {
    const { success, message, users } = await getUsersAction();

    return (
        <>
            {success ? (
                <Table className="md:whitespace-nowrap">
                    <TableCaption>Lista de usuarios</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-16">Id</TableHead>
                            <TableHead>Creación</TableHead>
                            <TableHead >Correo</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user) => {

                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="break-all md:break-normal">{user.id}</TableCell>
                                    <TableCell className="">{user.createdAt && formatDate(user.createdAt)}</TableCell>
                                    <TableCell className="break-all md:break-normal">{user.email}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <UpdateUserForm
                                            userId={user.id}
                                            roleUser={user.role}
                                            emailUser={user.email}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-4">
                    <span className="text-md text-red-500">{message}</span>
                </div>
            )}
        </>
    )
}