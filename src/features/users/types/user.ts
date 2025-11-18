export interface IUser {
    id: string;
    username: string;
    email: string;
    role: "admin" | "user";
    active: boolean;
    created?: string;
    updated?: string;
}

export interface IUserResponse {
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    users: IUser[];
}
