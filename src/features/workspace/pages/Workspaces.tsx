import { Link } from "react-router-dom"
import { Briefcase } from "@phosphor-icons/react"
import type { IGroup } from "../../groups/types/Group"
import { useUserWorkspaces } from "../hooks/useUserWorkspaces"
import { useAuthStore } from "../../../store/authStore"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Badge,
    PageHeader,
    PageContent,
    EmptyState
} from "../../../shared/components"

function Workspaces() {
    const user = useAuthStore(state => state.user);
    const isAdmin = useAuthStore(state => state.isAdmin);
    const userId = user?.id || null;

    const { groups, loading, error } = useUserWorkspaces(userId, isAdmin());

    return (
        <>
            <PageHeader
                title="Workspaces"
                description="Select a workspace to view and manage dashboards"
            />

            <PageContent>
                {error && (
                    <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm sm:text-base">
                        <p className="font-medium">Error: {error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : groups.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <EmptyState
                                icon={<Briefcase className="w-full h-full" />}
                                title="No workspaces found"
                                description="You don't have access to any workspaces yet. Contact your administrator."
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {groups.map((group: IGroup) => (
                            <Link
                                key={group.id}
                                to={`${group.id}/dashboards`}
                                className="group"
                            >
                                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="group-hover:text-primary-600 transition-colors text-base sm:text-lg line-clamp-2">
                                                {group.name}
                                            </CardTitle>
                                            <Badge variant="success" size="sm" className="shrink-0">Active</Badge>
                                        </div>
                                        {group.description && (
                                            <CardDescription className="text-sm line-clamp-2">
                                                {group.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-xs sm:text-sm text-primary-600 font-medium group-hover:underline">
                                            <Briefcase className="w-4 h-4 mr-1.5" />
                                            View dashboards
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </PageContent>
        </>
    )
}

export default Workspaces
