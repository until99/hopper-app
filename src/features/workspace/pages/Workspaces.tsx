import { Link } from "react-router-dom"
import type { IGroup } from "../../groups/types/Group"
import { useUserWorkspaces } from "../hooks/useUserWorkspaces"
import { useAuthStore } from "../../../store/authStore"
import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "../../../shared/components"

function Workspaces() {
    const user = useAuthStore(state => state.user);
    const userId = user?.id || null;
    
    const { groups, loading, error } = useUserWorkspaces(userId);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Container>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Workspaces</h1>
                    <p className="text-gray-600">Select a workspace to view and manage dashboards</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        <p className="font-medium">Error: {error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : groups.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No workspaces found</h3>
                            <p className="text-gray-500">You don't have access to any workspaces yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group: IGroup) => (
                            <Link 
                                key={group.id} 
                                to={`${group.id}/dashboards`}
                                className="group"
                            >
                                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="group-hover:text-primary-600 transition-colors">
                                                {group.name}
                                            </CardTitle>
                                            <Badge variant="success" size="sm">Active</Badge>
                                        </div>
                                        {group.description && (
                                            <CardDescription>{group.description}</CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            View dashboards
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Workspaces
