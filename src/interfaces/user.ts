export interface User {
  id: string;
  username: string;
  email: string;
  roles: "admin" | "user";
  created: string;
  updated: string;
}
