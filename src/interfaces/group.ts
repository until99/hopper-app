export interface IGroup {
    id: string;
    name: string;
    description: string;
    active: boolean;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
}

export interface IGroupsApiResponse {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: IGroup[];
}
