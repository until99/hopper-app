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
        } catch (err) {
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
        <div className="min-h-screen bg-gray-50 py-6">
            <Container maxWidth="full">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                    
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{dashboard.name}</h1>
                            {dashboard.description && (
                                <p className="text-gray-600">{dashboard.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-3">
                                <Badge variant="primary">Power BI</Badge>
                                {pipelineAssociated && <Badge variant="success">Pipeline Associated</Badge>}
                            </div>
                        </div>
                        
                        {pipelineAssociated && isAdmin() && (
                            <Button
                                variant="primary"
                                onClick={handleRefreshPipeline}
                                disabled={dashboardId ? refreshLoading[dashboardId] : false}
                                isLoading={dashboardId ? refreshLoading[dashboardId] : false}
                                className="gap-2"
                            >
                                <Play className="w-4 h-4" weight="fill" />
                                {dashboardId && refreshLoading[dashboardId] ? "Running..." : "Run Pipeline"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                {dashboardId && refreshError[dashboardId] && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <WarningCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-800 font-medium">Error running pipeline</p>
                            <p className="text-red-700 text-sm mt-1">{refreshError[dashboardId]}</p>
                        </div>
                    </div>
                )}

                {refreshSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800 font-medium">{refreshSuccess}</p>
                    </div>
                )}

                {/* Dashboard Embed */}
                <Card className="overflow-hidden">
                    <div className="bg-gray-900 p-1">
                        <iframe
                            title={dashboard.name}
                            className="w-full"
                            style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
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
