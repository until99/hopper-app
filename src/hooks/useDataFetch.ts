import { useDataStore } from "../store/dataStore";
import { dashboardService } from "../features/dashboard/services/dashboardService";
import { groupsService } from "../features/groups/services/groupsApiService";
import { usersService } from "../features/users/services/usersService";
import { pipelinesService } from "../features/pipelines/services/pipelinesService";
import { useAuthStore } from "../store/authStore";

interface FetchQueueItem {
  name: string;
  fetch: () => Promise<void>;
  priority: number;
}

class DataFetchQueue {
  private queue: FetchQueueItem[] = [];
  private isProcessing = false;
  private fetchPromises = new Map<string, Promise<void>>();

  async addToQueue(item: FetchQueueItem) {
    // Check if already in queue or being processed
    if (this.fetchPromises.has(item.name)) {
      return this.fetchPromises.get(item.name);
    }

    this.queue.push(item);
    this.queue.sort((a, b) => b.priority - a.priority);

    const promise = this.processQueue();
    this.fetchPromises.set(item.name, promise);

    return promise;
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      try {
        await item.fetch();
      } catch (error) {
        console.error(`Error fetching ${item.name}:`, error);
      } finally {
        this.fetchPromises.delete(item.name);
      }

      // Small delay between requests to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  clear() {
    this.queue = [];
    this.fetchPromises.clear();
  }
}

const fetchQueue = new DataFetchQueue();

export const useFetchDashboards = () => {
  const {
    dashboards,
    dashboardsState,
    setDashboards,
    setDashboardsState,
    isCacheValid,
  } = useDataStore();

  const fetchDashboards = async (force = false) => {
    // Check if cache is valid
    if (!force && isCacheValid(dashboardsState.lastFetch)) {
      console.log("Using cached dashboards");
      return dashboards;
    }

    // Check if already loading
    if (dashboardsState.loading) {
      console.log("Dashboards already loading");
      return dashboards;
    }

    const fetchFn = async () => {
      setDashboardsState({ loading: true, error: null });
      try {
        const response = await dashboardService.fetchDashboards();
        setDashboards(response.dashboards || []);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch dashboards";
        setDashboardsState({
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    };

    await fetchQueue.addToQueue({
      name: "dashboards",
      fetch: fetchFn,
      priority: 3,
    });

    return dashboards;
  };

  return {
    dashboards,
    loading: dashboardsState.loading,
    error: dashboardsState.error,
    fetchDashboards,
  };
};

export const useFetchGroups = () => {
  const { groups, groupsState, setGroups, setGroupsState, isCacheValid } =
    useDataStore();

  const { isAdmin } = useAuthStore();

  const fetchGroups = async (force = false) => {
    if (!force && isCacheValid(groupsState.lastFetch)) {
      console.log("Using cached groups");
      return groups;
    }

    if (groupsState.loading) {
      console.log("Groups already loading");
      return groups;
    }

    const fetchFn = async () => {
      setGroupsState({ loading: true, error: null });
      try {
        const response = await groupsService.fetchGroups(isAdmin());
        // Garantir que sempre seja um array
        const groupsArray = Array.isArray(response) ? response : [];
        setGroups(groupsArray);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch groups";
        setGroupsState({
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    };

    await fetchQueue.addToQueue({
      name: "groups",
      fetch: fetchFn,
      priority: 2,
    });

    return groups;
  };

  return {
    groups,
    loading: groupsState.loading,
    error: groupsState.error,
    fetchGroups,
  };
};

export const useFetchUsers = () => {
  const { users, usersState, setUsers, setUsersState, isCacheValid } =
    useDataStore();

  const fetchUsers = async (force = false) => {
    if (!force && isCacheValid(usersState.lastFetch)) {
      console.log("Using cached users");
      return users;
    }

    if (usersState.loading) {
      console.log("Users already loading");
      return users;
    }

    const fetchFn = async () => {
      setUsersState({ loading: true, error: null });
      try {
        const response = await usersService.fetchUsers(1, 1000);
        setUsers(response.users || []);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch users";
        setUsersState({
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    };

    await fetchQueue.addToQueue({
      name: "users",
      fetch: fetchFn,
      priority: 1,
    });

    return users;
  };

  return {
    users,
    loading: usersState.loading,
    error: usersState.error,
    fetchUsers,
  };
};

export const useFetchPipelines = () => {
  const {
    pipelines,
    pipelinesState,
    setPipelines,
    setPipelinesState,
    isCacheValid,
  } = useDataStore();

  const fetchPipelines = async (force = false) => {
    if (!force && isCacheValid(pipelinesState.lastFetch)) {
      console.log("Using cached pipelines");
      return pipelines;
    }

    if (pipelinesState.loading) {
      console.log("Pipelines already loading");
      return pipelines;
    }

    const fetchFn = async () => {
      setPipelinesState({ loading: true, error: null });
      try {
        const response = await pipelinesService.fetchPipelines();
        setPipelines(response.dags || []);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch pipelines";
        setPipelinesState({
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    };

    await fetchQueue.addToQueue({
      name: "pipelines",
      fetch: fetchFn,
      priority: 0,
    });

    return pipelines;
  };

  return {
    pipelines,
    loading: pipelinesState.loading,
    error: pipelinesState.error,
    fetchPipelines,
  };
};

// Hook to initialize all data
export const useInitializeData = () => {
  const { fetchDashboards } = useFetchDashboards();
  const { fetchGroups } = useFetchGroups();
  const { fetchUsers } = useFetchUsers();
  const { fetchPipelines } = useFetchPipelines();

  const initializeAllData = async (force = false) => {
    console.log("Initializing application data...");

    try {
      // Fetch all data in parallel with queue management
      await Promise.allSettled([
        fetchDashboards(force),
        fetchGroups(force),
        fetchUsers(force),
        fetchPipelines(force),
      ]);

      console.log("Application data initialized");
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  return { initializeAllData };
};
