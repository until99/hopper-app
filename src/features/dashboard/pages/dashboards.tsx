import { Link, useParams } from "react-router-dom";
import { ChartBar, FolderOpen } from "@phosphor-icons/react";
import { useGroupDashboards } from "../hooks/useGroupDashboards";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Loading, 
  Badge,
  PageHeader,
  PageContent,
  EmptyState
} from "../../../shared/components";

function Dashboards() {
  const { groupId } = useParams();
  const { dashboards, loading, error } = useGroupDashboards(groupId);

  return (
    <>
      <PageHeader
        title="Dashboards"
        description="Select a dashboard to view details and analytics"
        backTo="/workspaces"
        backLabel="Back to Workspaces"
      />

      <PageContent>
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm sm:text-base">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <Loading message="Loading dashboards..." />
        ) : dashboards.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={<FolderOpen className="w-full h-full" />}
                title="No dashboards found"
                description="This workspace doesn't have any dashboards yet"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                        <ChartBar className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                      </div>
                      <Badge variant="primary" size="sm">Active</Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary-600 transition-colors text-base sm:text-lg">
                      {dashboard.name}
                    </CardTitle>
                    {dashboard.description && (
                      <CardDescription className="text-sm line-clamp-2">
                        {dashboard.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                      <span className="text-gray-500 truncate">Group: {dashboard.groupName}</span>
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
      </PageContent>
    </>
  );
}

export default Dashboards;