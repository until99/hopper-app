import { User, PencilSimple, Trash, EnvelopeSimple, ShieldCheck } from "@phosphor-icons/react";
import type { IUser } from '../types/user';
import { Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Loading } from "../../../shared/components";

interface UsersTableProps {
    users: IUser[];
    loading: boolean;
    onEdit: (userId: string, username: string) => void;
    onDelete: (userId: string, username: string) => void;
}

export const UsersTable = ({ users, loading, onEdit, onDelete }: UsersTableProps) => {
    if (loading) {
        return (
            <Card>
                <Loading message="Loading users..." />
            </Card>
        );
    }

    if (!users || users.length === 0) {
        return (
            <Card>
                <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                    <p className="text-gray-500">Create your first user to get started</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <tr>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </tr>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                                        <User className="w-5 h-5 text-primary-600" weight="bold" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.username}</div>
                                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <EnvelopeSimple className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {user.role === "admin" ? (
                                    <Badge variant="primary" className="inline-flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5" weight="bold" />
                                        <span>Admin</span>
                                    </Badge>
                                ) : (
                                    <Badge variant="default">User</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.active ? "success" : "default"}>
                                    {user.active ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(user.id, user.username)}
                                        className="inline-flex items-center gap-1.5"
                                    >
                                        <PencilSimple className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(user.id, user.username)}
                                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash className="w-4 h-4" />
                                        <span>Delete</span>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
