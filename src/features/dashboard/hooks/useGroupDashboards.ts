import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";
import type { Dashboard } from "../types/dashboard";
import { useAuth } from "../../auth";

export const useGroupDashboards = (groupId: string | undefined) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const fetchDashboards = useCallback(async () => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.fetchGroupDashboards(
        groupId,
        isAdmin()
      );
      setDashboards(data.dashboards);
    } catch (err) {
      setError("Erro ao carregar dashboards");
      console.error("Error fetching dashboards:", err);
    } finally {
      setLoading(false);
    }
  }, [groupId, isAdmin]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboards = async () => {
      if (!groupId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.fetchGroupDashboards(
          groupId,
          isAdmin()
        );

        if (isMounted) {
          setDashboards(data.dashboards);
        }
      } catch (err) {
        if (isMounted) {
          setError("Erro ao carregar dashboards");
          console.error("Error fetching dashboards:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboards();

    return () => {
      isMounted = false;
    };
  }, [groupId, isAdmin]);

  return {
    dashboards,
    loading,
    error,
    refetch: fetchDashboards,
  };
};
