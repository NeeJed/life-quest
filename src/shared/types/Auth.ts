export interface IUser {
  id: string;
  email: string;
  name: string;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
