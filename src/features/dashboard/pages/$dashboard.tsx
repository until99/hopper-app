import { useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { useDashboardDetails } from "../hooks/useDashboardDetails";
import { usePipelineActions } from "../hooks/usePipelineActions";
import { Container, Card, CardContent, PageLoading, Button, Badge } from "../../../shared/components";

function DashboardId() {
    const { isAdmin } = useAuth();
    const { groupId, dashboardId } = useParams();
    const navigate = useNavigate();
    
    const { dashboard, loading, pipelineAssociated } = useDashboardDetails(groupId, dashboardId);
    const { runPipeline, refreshLoading, refreshError } = usePipelineActions();
    
    const [refreshSuccess, setRefreshSuccess] = useState("");

    const handleRefreshPipeline = async () => {
        if (!dashboardId) return;
        
        setRefreshSuccess("");
        
        if (!pipelineAssociated) {
            return;
        }

        try {
            await runPipeline(dashboardId);
            setRefreshSuccess("Pipeline executado com sucesso!");
            setTimeout(() => setRefreshSuccess(""), 5000);
        } catch {
            // Erro já tratado no hook
        }
    };

    if (loading) {
        return <PageLoading message="Loading dashboard..." />;
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="text-center py-12">
                        <WarningCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Dashboard not found</h3>
                        <p className="text-gray-500 mb-4">The dashboard you're looking for doesn't exist or has been removed</p>
                        <Button onClick={() => navigate('/workspaces')}>
                            Back to Workspaces
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-3 sm:py-4 lg:py-6">
            <Container maxWidth="full">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Back</span>
                    </button>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">{dashboard.name}</h1>
                            {dashboard.description && (
                                <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{dashboard.description}</p>
                            )}
                            <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3">
                                <Badge variant="primary" size="sm">Power BI</Badge>
                                {pipelineAssociated && <Badge variant="success" size="sm">Pipeline Associated</Badge>}
                            </div>
                        </div>
                        
                        {pipelineAssociated && isAdmin() && (
                            <Button
                                variant="primary"
                                onClick={handleRefreshPipeline}
                                disabled={dashboardId ? refreshLoading[dashboardId] : false}
                                isLoading={dashboardId ? refreshLoading[dashboardId] : false}
                                className="gap-2 w-full sm:w-auto shrink-0"
                                size="sm"
                            >
                                <Play className="w-4 h-4" weight="fill" />
                                <span className="hidden sm:inline">{dashboardId && refreshLoading[dashboardId] ? "Running..." : "Run Pipeline"}</span>
                                <span className="sm:hidden">{dashboardId && refreshLoading[dashboardId] ? "Running..." : "Run"}</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                {dashboardId && refreshError[dashboardId] && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
                        <WarningCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-red-800 font-medium text-sm sm:text-base">Error running pipeline</p>
                            <p className="text-red-700 text-xs sm:text-sm mt-1">{refreshError[dashboardId]}</p>
                        </div>
                    </div>
                )}

                {refreshSuccess && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 sm:gap-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <p className="text-green-800 font-medium text-sm sm:text-base">{refreshSuccess}</p>
                    </div>
                )}

                {/* Dashboard Embed */}
                <Card className="overflow-hidden">
                    <div className="p-0.5 sm:p-1">
                        <iframe
                            title={dashboard.name}
                            className="w-full"
                            style={{ 
                                height: 'calc(100vh - 200px)',
                                minHeight: '400px'
                            }}
                            src={`https://app.powerbi.com/reportEmbed?reportId=${dashboard.id}&autoAuth=true&ctid=a5504f25-7802-4f62-9940-f4a2f7eba746`}
                            allowFullScreen={true}
                        />
                    </div>
                </Card>
            </Container>
        </div>
    );
}

export default DashboardId;
