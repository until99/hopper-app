export interface IGroup {
    id: string
    name: string
    description: string
    active: boolean
    created: string
    updated: string
    collectionId?: string
    collectionName?: string
}

export interface IGroupsApiResponse {
    page: number
    perPage: number
    totalPages: number
    totalItems: number
    items: IGroup[]
}