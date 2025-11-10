import { Play, LinkBreak, Trash, ChartBar } from "@phosphor-icons/react";
import type { Dashboard, PipelineAssociation } from '../types/dashboard';
import { Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Loading } from "../../../shared/components";

interface DashboardsTableProps {
    dashboards: Dashboard[];
    loading: boolean;
    pipelineAssociation: PipelineAssociation;
    onDelete: (dashboardId: string, dashboardName: string, groupId: string, datasetId: string) => void;
    onRunPipeline: (dashboardId: string) => void;
    onUnlinkPipeline: (dashboardId: string) => void;
    refreshLoading: { [dashboardId: string]: boolean };
    refreshError: { [dashboardId: string]: string };
    unlinkLoading: { [dashboardId: string]: boolean };
    unlinkError: { [dashboardId: string]: string };
}

export const DashboardsTable = ({
    dashboards,
    loading,
    pipelineAssociation,
    onDelete,
    onRunPipeline,
    onUnlinkPipeline,
    refreshLoading,
    refreshError,
    unlinkLoading,
    unlinkError
}: DashboardsTableProps) => {
    if (loading) {
        return (
            <Card>
                <Loading message="Loading dashboards..." />
            </Card>
        );
    }

    if (!dashboards || dashboards.length === 0) {
        return (
            <Card>
                <div className="text-center py-12">
                    <ChartBar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No dashboards found</h3>
                    <p className="text-gray-500">Create your first dashboard to get started</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <tr>
                        <TableHead>Dashboard</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Pipeline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </tr>
                </TableHeader>
                <TableBody>
                    {dashboards.map(dashboard => (
                        <TableRow key={dashboard.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary-100 rounded-lg">
                                        <ChartBar className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{dashboard.name}</div>
                                        <div className="text-xs text-gray-500">{dashboard.id}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium text-gray-700">{dashboard.groupName}</div>
                                    <div className="text-xs text-gray-500">{dashboard.groupId}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {pipelineAssociation[dashboard.id] ? (
                                    <div className="space-y-2">
                                        <Badge variant="success" size="sm">Connected</Badge>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => onRunPipeline(dashboard.id)}
                                                disabled={refreshLoading[dashboard.id]}
                                                isLoading={refreshLoading[dashboard.id]}
                                                className="gap-1"
                                            >
                                                <Play className="w-3 h-3" weight="fill" />
                                                {refreshLoading[dashboard.id] ? 'Running...' : 'Run'}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => onUnlinkPipeline(dashboard.id)}
                                                disabled={unlinkLoading[dashboard.id]}
                                                isLoading={unlinkLoading[dashboard.id]}
                                                className="gap-1"
                                            >
                                                <LinkBreak className="w-3 h-3" />
                                                {unlinkLoading[dashboard.id] ? 'Unlinking...' : 'Unlink'}
                                            </Button>
                                        </div>
                                        {refreshError[dashboard.id] && (
                                            <p className="text-xs text-red-600">{refreshError[dashboard.id]}</p>
                                        )}
                                        {unlinkError[dashboard.id] && (
                                            <p className="text-xs text-red-600">{unlinkError[dashboard.id]}</p>
                                        )}
                                    </div>
                                ) : (
                                    <Badge variant="default" size="sm">Not Connected</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(dashboard.id, dashboard.name, dashboard.groupId, dashboard.datasetId)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        title="Delete dashboard"
                                    >
                                        <Trash className="w-4 h-4" />
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
