import { GitBranch, Link, Calendar, FolderOpen } from "@phosphor-icons/react";
import type { DagPipeline } from '../types/pipeline';
import { Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Loading } from "../../../shared/components";

interface PipelinesTableProps {
    pipelines: DagPipeline[];
    loading: boolean;
    onLinkDashboard: (pipelineId: string) => void;
}

export const PipelinesTable = ({ pipelines, loading, onLinkDashboard }: PipelinesTableProps) => {
    if (loading) {
        return (
            <Card>
                <Loading message="Loading pipelines..." />
            </Card>
        );
    }

    if (!pipelines || pipelines.length === 0) {
        return (
            <Card>
                <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No pipelines found</h3>
                    <p className="text-gray-500">No data pipelines available at the moment</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <tr>
                        <TableHead>Pipeline</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </tr>
                </TableHeader>
                <TableBody>
                    {pipelines.map(pipeline => (
                        <TableRow key={pipeline.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                                        <GitBranch className="w-5 h-5 text-primary-600" weight="bold" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{pipeline.id}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-gray-600">{pipeline.description || "No description"}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">
                                        {pipeline.timetable_description || "Not scheduled"}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onLinkDashboard(pipeline.id)}
                                    className="inline-flex items-center gap-1.5"
                                >
                                    <Link className="w-4 h-4" />
                                    <span>Link Dashboard</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
