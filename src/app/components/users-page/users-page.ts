import { Component } from '@angular/core';
import { AddUserForm } from '../add-user-form/add-user-form';
import { UsersTable } from '../users-table/users-table';
import { Store } from '@ngrx/store';
import { selectIsAdmin, selectIsEditor } from '../../store/login/login.selector';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-users-page',
  imports: [AddUserForm, UsersTable, AsyncPipe],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})

export class UsersPage {
  isAdmin$: Observable<boolean>;
  isEditor$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.isEditor$ = this.store.select(selectIsEditor);
  }
}

