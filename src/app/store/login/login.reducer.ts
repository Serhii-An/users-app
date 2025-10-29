import { createReducer, on } from '@ngrx/store';
import { initialLoginState } from './login.state';
import * as LoginActions from './login.actions';

export const loginReducer = createReducer(
  initialLoginState,
  on(LoginActions.loginSuccess, (state, { login, flags }) => ({
    ...state,
    login,
    ...flags

    })),

    on(LoginActions.logout, () => initialLoginState)

);

