import { createSelector } from '@ngrx/store';
import { LoginState } from './login.state';

export const selectLoginState = (state: { login: LoginState }) => state.login;

export const selectIsLoggedIn = createSelector(
  selectLoginState,
  (state) => !!state.login
);

export const selectLoggedUser = createSelector(
  selectLoginState,
  state => state.login
);

export const selectIsAdmin = createSelector(
  selectLoginState,
  login => !!login.admin
);

export const selectIsEditor = createSelector(
  selectLoginState,
  login => !!login.editor
);




