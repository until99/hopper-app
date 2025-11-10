import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, ArrowLeft, Trash, Plus, EnvelopeSimple, ShieldCheck, UsersThree } from "@phosphor-icons/react";
import { useGroupInfo } from "../../hooks/useGroupInfo";
import { useGroupUsers } from "../../hooks/useGroupUsers";
import AddUsersToGroupModal from "../../modals/AddUsersToGroupModal";
import { Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Loading, Badge } from "../../../../shared/components";

export default function GroupUsers() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    
    const { group } = useGroupInfo(groupId);
    const { users, loading, removeUser, refetch } = useGroupUsers(groupId);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleRemoveUser = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this user from the group?")) {
            return;
        }

        try {
            await removeUser(userId);
        } catch (error: any) {
            console.error("Error removing user from group:", error);
            alert("Failed to remove user from group");
        }
    }

    const handleUsersAdded = () => {
        refetch();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <AddUsersToGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                groupId={groupId || null}
                groupName={group?.name || "Grupo"}
                onUsersAdded={handleUsersAdded}
            />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/groups")}
                        className="inline-flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Groups</span>
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <UsersThree className="w-8 h-8 text-primary-600" weight="bold" />
                                {group?.name || "Group"} - Users
                            </h1>
                            <p className="text-gray-600">Manage users associated with this group</p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" weight="bold" />
                            Add Users
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <Card>
                        <Loading message="Loading users..." />
                    </Card>
                ) : !users || users.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                            <p className="text-gray-500 mb-4">Add users to this group to get started</p>
                            <Button
                                variant="primary"
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" weight="bold" />
                                Add Users
                            </Button>
                        </div>
                    </Card>
                ) : (
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
                                {users.map(user => (
                                    <TableRow key={user.user_id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                                                    <User className="w-5 h-5 text-primary-600" weight="bold" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.username}</div>
                                                    <div className="text-sm text-gray-500">ID: {user.user_id}</div>
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
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveUser(user.user_id)}
                                                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash className="w-4 h-4" />
                                                <span>Remove</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </div>
    );
}