import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../services/data.service';
import * as UsersActions from './users.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class UsersEffects {
    private actions$ = inject(Actions);
    private dataService = inject(DataService);

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UsersActions.loadUsers),
        mergeMap(() =>
            this.dataService.getUsers().pipe(
            map(users => UsersActions.loadUsersSuccess({ users })),
            catchError(error =>
                of(UsersActions.loadUsersFailure({ error: error.message }))
            )
            )
        )
        )
    );
}