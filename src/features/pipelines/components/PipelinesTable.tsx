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
                <div className="p-4 sm:p-6">
                    <Loading message="Loading pipelines..." />
                </div>
            </Card>
        );
    }

    if (!pipelines || pipelines.length === 0) {
        return (
            <Card>
                <div className="text-center py-8 sm:py-12 px-4">
                    <FolderOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No pipelines found</h3>
                    <p className="text-sm sm:text-base text-gray-500">No data pipelines available at the moment</p>
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
                            <TableHead>Pipeline</TableHead>
                            <TableHead className="hidden lg:table-cell">Description</TableHead>
                            <TableHead className="hidden md:table-cell">Schedule</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {pipelines.map(pipeline => (
                            <TableRow key={pipeline.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100">
                                            <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" weight="bold" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{pipeline.id}</div>
                                            {/* Show description on mobile */}
                                            <div className="lg:hidden text-xs text-gray-600 mt-1 line-clamp-2">{pipeline.description || "No description"}</div>
                                            {/* Show schedule on mobile/tablet */}
                                            <div className="md:hidden flex items-center gap-1 text-xs text-gray-600 mt-1.5">
                                                <Calendar className="w-3 h-3" />
                                                <span className="truncate">{pipeline.timetable_description || "Not scheduled"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    <span className="text-gray-600 text-sm">{pipeline.description || "No description"}</span>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
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
                                        className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2"
                                    >
                                        <Link className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline text-sm">Link Dashboard</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};
