import { Link, useParams } from "react-router-dom";
import { ChartBar, ArrowLeft, FolderOpen } from "@phosphor-icons/react";
import { useGroupDashboards } from "../hooks/useGroupDashboards";
import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent, Loading, Badge } from "../../../shared/components";

function Dashboards() {
  const { groupId } = useParams();
  const { dashboards, loading, error } = useGroupDashboards(groupId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link 
            to="/workspaces" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Workspaces
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboards</h1>
          <p className="text-gray-600">Select a dashboard to view details and analytics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <Loading message="Loading dashboards..." />
        ) : dashboards.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No dashboards found</h3>
              <p className="text-gray-500">This workspace doesn't have any dashboards yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <Link 
                key={dashboard.id} 
                to={`${dashboard.id}`}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <ChartBar className="w-6 h-6 text-primary-600" />
                      </div>
                      <Badge variant="primary" size="sm">Active</Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary-600 transition-colors">
                      {dashboard.name}
                    </CardTitle>
                    {dashboard.description && (
                      <CardDescription>{dashboard.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Group: {dashboard.groupName}</span>
                      <span className="text-primary-600 font-medium group-hover:underline">
                        View →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Dashboards;