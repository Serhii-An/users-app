import { Component, inject } from '@angular/core';
import { selectLoggedUser } from '../../store/login/login.selector';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { logout } from '../../store/login/login.actions';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private store = inject(Store);
  loggedUser$ = this.store.select(selectLoggedUser);

  onLogout() {
    this.store.dispatch(logout());

  }
}
