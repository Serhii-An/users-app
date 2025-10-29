import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as LoginActions from './login.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoginEffects {
    private actions$ = inject(Actions);
    private router = inject(Router);
    loginSuccess$ = createEffect(
        () =>
        this.actions$.pipe(
            ofType(LoginActions.loginSuccess),
            tap(() => {
                this.router.navigate(['/users']);
            })
        ),
        { dispatch: false }
    );
}