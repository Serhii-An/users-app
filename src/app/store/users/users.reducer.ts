import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { initialUsersState } from './users.state';

export const usersReducer = createReducer(
  initialUsersState,

  on(UsersActions.loadUsers, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    allUsers: users,
    loading: false,
    error: null
  })),

  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);