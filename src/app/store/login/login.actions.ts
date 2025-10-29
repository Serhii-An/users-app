import { createAction, props } from '@ngrx/store';

export const loginSuccess = createAction(
  '[Auth] Login Success',
    props<{ login: string; flags?: Record<string, boolean> }>()
);

export const logout = createAction('[Auth] Logout');