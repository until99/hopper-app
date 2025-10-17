export interface IUser {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  active: boolean;
  created: string;
  updated: string;
}
