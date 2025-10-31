export interface IPipeline {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created: string;
  updated: string;
  dashboards: string[]; // IDs dos dashboards vinculados
}

export interface IPipelinesApiResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: IPipeline[];
}
