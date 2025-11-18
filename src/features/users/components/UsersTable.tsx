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
                <div className="p-4 sm:p-6">
                    <Loading message="Loading users..." />
                </div>
            </Card>
        );
    }

    if (!users || users.length === 0) {
        return (
            <Card>
                <div className="text-center py-8 sm:py-12 px-4">
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No users found</h3>
                    <p className="text-sm sm:text-base text-gray-500">Create your first user to get started</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableHead>User</TableHead>
                            <TableHead className="hidden lg:table-cell">Email</TableHead>
                            <TableHead className="hidden md:table-cell">Role</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" weight="bold" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm sm:text-base">{user.username}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-none">ID: {user.id}</div>
                                            {/* Show email on mobile */}
                                            <div className="lg:hidden flex items-center gap-1 text-xs text-gray-600 mt-1">
                                                <EnvelopeSimple className="w-3 h-3" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            {/* Show role and status on mobile/tablet */}
                                            <div className="md:hidden flex items-center gap-2 mt-1.5">
                                                {user.role === "admin" ? (
                                                    <Badge variant="primary" size="sm" className="inline-flex items-center gap-1">
                                                        <ShieldCheck className="w-3 h-3" weight="bold" />
                                                        <span className="text-xs">Admin</span>
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="default" size="sm">User</Badge>
                                                )}
                                                <Badge variant={user.active ? "success" : "default"} size="sm">
                                                    {user.active ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <EnvelopeSimple className="w-4 h-4" />
                                        <span>{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {user.role === "admin" ? (
                                        <Badge variant="primary" className="inline-flex items-center gap-1">
                                            <ShieldCheck className="w-3.5 h-3.5" weight="bold" />
                                            <span>Admin</span>
                                        </Badge>
                                    ) : (
                                        <Badge variant="default">User</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant={user.active ? "success" : "default"}>
                                        {user.active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(user.id, user.username)}
                                            className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2"
                                        >
                                            <PencilSimple className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="hidden lg:inline text-sm">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(user.id, user.username)}
                                            className="inline-flex items-center gap-1 sm:gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2"
                                        >
                                            <Trash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="hidden lg:inline text-sm">Delete</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};
