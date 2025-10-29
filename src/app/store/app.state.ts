import { LoginState } from './login/login.state';
import { UsersState } from './users/users.state';

export interface AppState {
  users: UsersState;
  login: LoginState;
}