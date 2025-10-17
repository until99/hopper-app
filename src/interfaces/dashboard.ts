export interface IGroups {
  id: string;
  isReadOnly: boolean;
  isOnDedicatedCapacity: boolean;
  type: string;
  name: string;
}

export interface IDashboard {
  id: string;
  reportType: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  isFromPbix: boolean;
  isOwnedByMe: boolean;
  datasetId: string;
  description: string;
  datasetWorkspaceId: string;
  users: [];
  subscriptions: [];
  reportFlags: number;
}
