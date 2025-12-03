import { Link } from "react-router-dom";
import type { IGroup } from "../types/Group";
import { Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button } from "../../../shared/components";

interface GroupsTableProps {
    groups: IGroup[];
    loading: boolean;
    onEdit: (groupId: string, groupName: string) => void;
    onDelete: (groupId: string, groupName: string) => void;
    onAddUsers: (groupId: string, groupName: string) => void;
    onAddDashboards: (groupId: string, groupName: string) => void;
}

export const GroupsTable = ({
    groups,
    loading,
    onEdit,
    onDelete,
    onAddUsers,
    onAddDashboards
}: GroupsTableProps) => {
    // Garantir que groups seja sempre um array
    const groupsList = Array.isArray(groups) ? groups : [];

    if (loading) {
        return (
            <Card>
                <div className="animate-pulse p-4 sm:p-6">
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </Card>
        );
    }

    if (!groupsList || groupsList.length === 0) {
        return (
            <Card>
                <div className="text-center py-8 sm:py-12 px-4">
                    <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No groups found</h3>
                    <p className="text-sm sm:text-base text-gray-500">Get started by creating a new group</p>
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
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {groupsList.map((group) => (
                            <TableRow key={group.id}>
                                <TableCell>
                                    <div className="font-medium text-gray-900 text-sm sm:text-base">{group.name}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-none">{group.id}</div>
                                    {/* Show description on mobile */}
                                    <div className="md:hidden text-xs text-gray-600 mt-1 line-clamp-2">{group.description || '—'}</div>
                                    {/* Show status on mobile */}
                                    <div className="sm:hidden mt-2">
                                        <Badge variant={group.active ? 'success' : 'default'} size="sm">
                                            {group.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <span className="text-gray-600 text-sm">{group.description || '—'}</span>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant={group.active ? 'success' : 'default'} size="sm">
                                        {group.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-1 sm:gap-2 flex-wrap">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(group.id, group.name)}
                                            title="Edit group"
                                            className="p-1.5 sm:p-2"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onAddUsers(group.id, group.name)}
                                            title="Add users"
                                            className="p-1.5 sm:p-2"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onAddDashboards(group.id, group.name)}
                                            title="Add dashboards"
                                            className="p-1.5 sm:p-2"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </Button>
                                        <Link to={`/admin/groups/${group.id}/users`}>
                                            <Button variant="ghost" size="sm" title="View users" className="p-1.5 sm:p-2">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Button>
                                        </Link>
                                        <Link to={`/admin/groups/${group.id}/dashboards`}>
                                            <Button variant="ghost" size="sm" title="View dashboards" className="p-1.5 sm:p-2">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(group.id, group.name)}
                                            title="Delete group"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
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
