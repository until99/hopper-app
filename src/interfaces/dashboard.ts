export interface IGroups {
  id: string;
  isReadOnly: boolean;
  isOnDedicatedCapacity: boolean;
  type: string;
  name: string;
}

export interface IPosts {
  userId: number;
  id: number;
  title: string;
  body: string;
}
