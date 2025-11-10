import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChartBar, ArrowLeft, Trash, Plus, FolderOpen } from "@phosphor-icons/react";
import { useGroupInfo } from "../../hooks/useGroupInfo";
import { useGroupDashboards } from "../../hooks/useGroupDashboards";
import AddDashboardsToGroupModal from "../../modals/AddDashboardsToGroupModal";
import { Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Loading } from "../../../../shared/components";

export default function GroupDashboards() {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const { group } = useGroupInfo(groupId);
    const { dashboards, loading, removeDashboard, refetch } = useGroupDashboards(groupId);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleRemoveDashboard = async (dashboardId: string) => {
        if (!confirm("Are you sure you want to remove this dashboard from the group?")) {
            return;
        }

        try {
            await removeDashboard(dashboardId);
        } catch (error: any) {
            console.error("Error removing dashboard from group:", error);
            alert("Failed to remove dashboard from group");
        }
    }

    const handleDashboardsAdded = () => {
        refetch();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <AddDashboardsToGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                groupId={groupId || null}
                groupName={group?.name || "Grupo"}
                onDashboardsAdded={handleDashboardsAdded}
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
                                <ChartBar className="w-8 h-8 text-primary-600" weight="bold" />
                                {group?.name || "Group"} - Dashboards
                            </h1>
                            <p className="text-gray-600">Manage dashboards associated with this group</p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" weight="bold" />
                            Add Dashboards
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <Card>
                        <Loading message="Loading dashboards..." />
                    </Card>
                ) : !dashboards || dashboards.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No dashboards found</h3>
                            <p className="text-gray-500 mb-4">Add dashboards to this group to get started</p>
                            <Button
                                variant="primary"
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" weight="bold" />
                                Add Dashboards
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHead>Dashboard</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {dashboards.map(dashboard => (
                                    <TableRow key={dashboard.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                                                    <ChartBar className="w-5 h-5 text-primary-600" weight="bold" />
                                                </div>
                                                <div className="font-medium text-gray-900">{dashboard.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-500 font-mono">{dashboard.id}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveDashboard(dashboard.id)}
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