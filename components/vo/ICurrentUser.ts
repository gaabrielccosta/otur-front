import { IUser } from "./IUser";

export interface ICurrentUser {
  authenticated: boolean;
  user: IUser | null;
}
